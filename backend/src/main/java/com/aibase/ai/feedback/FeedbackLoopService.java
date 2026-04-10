package com.aibase.ai.feedback;

import com.aibase.ai.feedback.dto.FeedbackRequest;
import com.aibase.ai.feedback.dto.FeedbackResponse;
import com.aibase.ai.feedback.dto.FeedbackResponse.FeedbackIteration;
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
 * 적응형 피드백 루프 서비스.
 *
 * 출처: novel_studio 프로젝트의 12단계 생성 파이프라인 + 적응형 피드백 루프 이식.
 *
 * 동작: 작성 → AI 평가(점수+제안) → 수정 → 재평가 → 수렴(80점 이상 또는 maxIterations)
 */
@Service
public class FeedbackLoopService {

    private static final Logger log = LoggerFactory.getLogger(FeedbackLoopService.class);
    private static final int CONVERGENCE_THRESHOLD = 80;

    private final AnthropicClient anthropicClient;
    private final ObjectMapper objectMapper;
    private final String model;

    public FeedbackLoopService(
            AnthropicClient anthropicClient,
            ObjectMapper objectMapper,
            @Value("${anthropic.model:claude-haiku-4-5-20251001}") String model) {
        this.anthropicClient = anthropicClient;
        this.objectMapper = objectMapper;
        this.model = model;
    }

    public FeedbackResponse run(FeedbackRequest request) {
        String currentText = request.text();
        List<FeedbackIteration> iterations = new ArrayList<>();
        boolean converged = false;

        for (int i = 1; i <= request.maxIterations(); i++) {
            EvaluationResult eval = evaluate(currentText);
            log.info("피드백 루프 [{}회차] — 점수: {}", i, eval.score());

            if (eval.score() >= CONVERGENCE_THRESHOLD) {
                iterations.add(new FeedbackIteration(i, eval.score(), eval.suggestions(), currentText));
                converged = true;
                break;
            }

            String improved = improve(currentText, eval.suggestions());
            iterations.add(new FeedbackIteration(i, eval.score(), eval.suggestions(), improved));
            currentText = improved;
        }

        int finalScore = iterations.isEmpty() ? 0 : iterations.get(iterations.size() - 1).score();
        return new FeedbackResponse(request.text(), currentText, iterations, finalScore, converged);
    }

    private EvaluationResult evaluate(String text) {
        String prompt = String.format("""
                다음 글을 평가하고 JSON으로 반환해주세요:
                {
                  "score": 0~100,
                  "suggestions": ["개선사항1", "개선사항2", "개선사항3"]
                }
                기준: 가독성(30), 완성도(30), 구성(20), 표현력(20).
                JSON만 출력.

                글: %s
                """, text.length() > 500 ? text.substring(0, 500) + "..." : text);

        String raw = callClaude(prompt, 512);
        try {
            String clean = raw.trim().replaceAll("```json?|```", "").trim();
            JsonNode node = objectMapper.readTree(clean);
            int score = node.path("score").asInt(50);
            List<String> suggestions = new ArrayList<>();
            node.path("suggestions").forEach(s -> suggestions.add(s.asText()));
            return new EvaluationResult(score, suggestions);
        } catch (Exception e) {
            return new EvaluationResult(50, List.of("구체적인 내용 추가", "문장 다듬기", "결론 강화"));
        }
    }

    private String improve(String text, List<String> suggestions) {
        String suggestionStr = String.join(", ", suggestions);
        String prompt = String.format("""
                다음 글을 개선해주세요. 개선 사항: %s
                개선된 글만 출력 (설명 없이).

                원문: %s
                """, suggestionStr, text.length() > 800 ? text.substring(0, 800) + "..." : text);

        return callClaude(prompt, 2048);
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
            throw new BusinessException("피드백 루프 AI 호출 실패: " + e.getMessage(), HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private record EvaluationResult(int score, List<String> suggestions) {}
}
