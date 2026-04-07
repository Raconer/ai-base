package com.aibase.ai.sentiment;

import com.aibase.ai.sentiment.dto.SentimentRequest;
import com.aibase.ai.sentiment.dto.SentimentResponse;
import com.aibase.common.exception.BusinessException;
import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlock;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SentimentService {

    private final AnthropicClient anthropicClient;
    private final ObjectMapper objectMapper;

    @Value("${anthropic.model:claude-haiku-4-5-20251001}")
    private String model;

    /**
     * 텍스트 감성 분석 — Claude API 활용
     * 출처: stock_traders 프로젝트의 뉴스 감성분석 로직을 이식
     */
    public SentimentResponse analyze(SentimentRequest request) {
        String prompt = String.format("""
                다음 텍스트의 감성을 분석하고 JSON 형식으로 반환해주세요:
                {
                  "label": "POSITIVE" 또는 "NEGATIVE" 또는 "NEUTRAL",
                  "positive": 0.0~1.0 사이 긍정 점수,
                  "negative": 0.0~1.0 사이 부정 점수,
                  "neutral": 0.0~1.0 사이 중립 점수,
                  "summary": "한줄 평가"
                }

                규칙:
                - positive + negative + neutral = 1.0 (합이 1이 되도록)
                - label은 가장 높은 점수의 레이블
                - summary는 20자 이내
                - JSON만 반환 (다른 텍스트 없이)

                텍스트:
                %s
                """, request.text());

        try {
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.of(model))
                    .maxTokens(256)
                    .addUserMessage(prompt)
                    .build();

            Message message = anthropicClient.messages().create(params);

            String rawJson = message.content().stream()
                    .filter(b -> b instanceof TextBlock)
                    .map(b -> ((TextBlock) b).text())
                    .findFirst()
                    .orElse("{}");

            // JSON 파싱
            String cleanJson = rawJson.trim();
            if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.replaceAll("```json?", "").replaceAll("```", "").trim();
            }

            JsonNode node = objectMapper.readTree(cleanJson);
            String label = node.path("label").asText("NEUTRAL");
            double positive = node.path("positive").asDouble(0.33);
            double negative = node.path("negative").asDouble(0.33);
            double neutral = node.path("neutral").asDouble(0.34);
            String summary = node.path("summary").asText("");

            double score = switch (label) {
                case "POSITIVE" -> positive;
                case "NEGATIVE" -> negative;
                default -> neutral;
            };

            log.debug("감성 분석 완료 — label: {}, score: {:.2f}", label, score);
            return new SentimentResponse(label, score, positive, negative, neutral, summary);

        } catch (Exception e) {
            log.error("감성 분석 실패: {}", e.getMessage());
            throw new BusinessException("감성 분석에 실패했습니다: " + e.getMessage(), HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    /**
     * Post 감성 분석 후 점수 반환 (0.0~1.0, 높을수록 긍정)
     */
    public double analyzeScore(String text) {
        SentimentResponse result = analyze(new SentimentRequest(text));
        return result.positive();
    }
}
