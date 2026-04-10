package com.aibase.ai.llm;

import com.aibase.ai.llm.dto.LlmCorrectRequest;
import com.aibase.ai.llm.dto.LlmResponse;
import com.aibase.ai.llm.dto.LlmSummarizeRequest;
import com.aibase.common.exception.BusinessException;
import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LlmService {

    private final AnthropicClient anthropicClient;

    @Value("${anthropic.model:claude-haiku-4-5-20251001}")
    private String model;

    @Value("${anthropic.max-tokens:2048}")
    private int maxTokens;

    /**
     * 글 AI 교정 — 오타 수정, 문법 교정, 톤 개선
     */
    public LlmResponse correctPost(LlmCorrectRequest request) {
        String tone = request.tone() != null ? request.tone() : "natural";

        String prompt = String.format("""
                다음 글을 교정해주세요. 요청 사항:
                1. 오타와 맞춤법 오류 수정
                2. 어색한 문장 자연스럽게 개선
                3. 문체 톤: %s (formal=격식체, casual=구어체, technical=기술적, natural=원문 유지)
                4. 원문의 의도와 내용은 최대한 보존
                5. 교정된 글만 출력 (설명, 부연 없이)

                원문:
                %s
                """, tone, request.text());

        return callClaude(prompt);
    }

    /**
     * 이력서 요약 — 핵심 내용 자동 요약
     */
    public LlmResponse summarizeResume(LlmSummarizeRequest request) {
        int targetLength = request.maxLength() > 0 ? request.maxLength() : 200;

        String prompt = String.format("""
                다음 이력서 내용을 %d단어 이내로 핵심만 요약해주세요. 요청 사항:
                1. 주요 경력과 기술 스택 중심
                2. 강점과 차별점 부각
                3. 채용 담당자가 빠르게 파악할 수 있도록 간결하게
                4. 요약문만 출력 (설명 없이)

                이력서 내용:
                %s
                """, targetLength, request.text());

        return callClaude(prompt);
    }

    /**
     * 글 품질 평가 — 점수(0~100)와 개선 제안
     */
    public LlmResponse evaluatePost(String text) {
        String prompt = String.format("""
                다음 글을 평가하고 JSON 형식으로 결과를 반환해주세요:
                {
                  "score": 0~100 사이 점수,
                  "strengths": ["강점1", "강점2"],
                  "improvements": ["개선사항1", "개선사항2"],
                  "summary": "한줄 평가"
                }

                평가 기준: 가독성(30점), 내용 완성도(30점), 구성(20점), 표현력(20점)

                글:
                %s
                """, text);

        return callClaude(prompt);
    }

    private LlmResponse callClaude(String userMessage) {
        try {
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.of(model))
                    .maxTokens(maxTokens)
                    .addUserMessage(userMessage)
                    .build();

            Message message = anthropicClient.messages().create(params);

            String resultText = message.content().stream()
                    .filter(block -> block.isText())
                    .map(block -> block.asText().text())
                    .findFirst()
                    .orElse("");

            int inputTokens = (int) message.usage().inputTokens();
            int outputTokens = (int) message.usage().outputTokens();

            log.debug("LLM 호출 완료 — 입력 토큰: {}, 출력 토큰: {}", inputTokens, outputTokens);

            return new LlmResponse(resultText, model, inputTokens, outputTokens);

        } catch (Exception e) {
            log.error("LLM API 호출 실패: {}", e.getMessage());
            throw new BusinessException("AI 서비스 호출에 실패했습니다: " + e.getMessage(), HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
