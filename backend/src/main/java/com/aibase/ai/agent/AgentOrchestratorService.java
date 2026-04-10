package com.aibase.ai.agent;

import com.aibase.ai.agent.dto.AgentRequest;
import com.aibase.ai.agent.dto.AgentResponse;
import com.aibase.ai.agent.dto.AgentResponse.AgentStep;
import com.aibase.common.exception.BusinessException;
import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 멀티 에이전트 오케스트레이터.
 *
 * 출처: stock_traders 프로젝트의 Claude API 파이프라인 + novel_studio 다단계 생성 이식.
 *
 * 에이전트 파이프라인:
 *   ① 분류 에이전트 — 글 카테고리 분류 (tech/life/career/etc)
 *   ② 태그 에이전트 — 키워드 추출 → 태그 5개 생성
 *   ③ 요약 에이전트 — 2~3문장 요약 생성
 */
@Service
public class AgentOrchestratorService {

    private static final Logger log = LoggerFactory.getLogger(AgentOrchestratorService.class);

    private final AnthropicClient anthropicClient;
    private final ObjectMapper objectMapper;

    @Value("${anthropic.model:claude-haiku-4-5-20251001}")
    private String model;

    public AgentOrchestratorService(AnthropicClient anthropicClient, ObjectMapper objectMapper) {
        this.anthropicClient = anthropicClient;
        this.objectMapper = objectMapper;
    }

    public AgentResponse classify(AgentRequest request) {
        List<AgentStep> steps = new ArrayList<>();
        String text = request.text();

        // ① 분류 에이전트
        String category = runClassifyAgent(text, steps);

        // ② 태그 에이전트
        List<String> tags = runTagAgent(text, category, steps);

        // ③ 요약 에이전트
        String summary = runSummaryAgent(text, steps);

        return new AgentResponse(category, tags, summary, steps);
    }

    private String runClassifyAgent(String text, List<AgentStep> steps) {
        long start = System.currentTimeMillis();
        String prompt = String.format("""
                글을 아래 카테고리 중 하나로 분류하고 JSON으로 반환:
                {"category": "tech|life|career|review|tutorial|other"}
                JSON만 출력.

                글: %s
                """, truncate(text, 400));

        String raw = callClaude(prompt, 64);
        String category = "other";
        try {
            String clean = raw.trim().replaceAll("```json?|```", "").trim();
            category = objectMapper.readTree(clean).path("category").asText("other");
        } catch (Exception ignored) {}

        long duration = System.currentTimeMillis() - start;
        log.info("[분류 에이전트] category={} ({}ms)", category, duration);
        steps.add(new AgentStep("분류 에이전트", truncate(text, 100), category, duration));
        return category;
    }

    private List<String> runTagAgent(String text, String category, List<AgentStep> steps) {
        long start = System.currentTimeMillis();
        String prompt = String.format("""
                카테고리: %s
                다음 글에서 핵심 태그 5개를 추출해 JSON으로 반환:
                {"tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]}
                영어 소문자, 하이픈 허용. JSON만 출력.

                글: %s
                """, category, truncate(text, 400));

        String raw = callClaude(prompt, 128);
        List<String> tags = new ArrayList<>();
        try {
            String clean = raw.trim().replaceAll("```json?|```", "").trim();
            objectMapper.readTree(clean).path("tags").forEach(t -> tags.add(t.asText()));
        } catch (Exception ignored) {
            tags.add("general");
        }

        long duration = System.currentTimeMillis() - start;
        log.info("[태그 에이전트] tags={} ({}ms)", tags, duration);
        steps.add(new AgentStep("태그 에이전트", category, String.join(", ", tags), duration));
        return tags;
    }

    private String runSummaryAgent(String text, List<AgentStep> steps) {
        long start = System.currentTimeMillis();
        String prompt = String.format("""
                다음 글을 2~3문장으로 요약. 요약문만 출력.

                글: %s
                """, truncate(text, 600));

        String summary = callClaude(prompt, 256);

        long duration = System.currentTimeMillis() - start;
        log.info("[요약 에이전트] ({}ms)", duration);
        steps.add(new AgentStep("요약 에이전트", truncate(text, 100), summary, duration));
        return summary;
    }

    private String callClaude(String prompt, int maxTokens) {
        try {
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.of(model))
                    .maxTokens(maxTokens)
                    .addUserMessage(prompt)
                    .build();
            Message message = anthropicClient.messages().create(params);
            return message.content().stream()
                    .filter(b -> b.isText())
                    .map(b -> b.asText().text())
                    .findFirst().orElse("");
        } catch (Exception e) {
            throw new BusinessException("멀티 에이전트 AI 호출 실패: " + e.getMessage(), HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private String truncate(String text, int maxLen) {
        return text.length() > maxLen ? text.substring(0, maxLen) + "..." : text;
    }
}
