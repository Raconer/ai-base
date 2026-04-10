package com.aibase.ai.feedback;

import com.aibase.ai.feedback.dto.FeedbackRequest;
import com.aibase.ai.feedback.dto.FeedbackResponse;
import com.anthropic.client.AnthropicClient;
import com.anthropic.services.blocking.MessageService;
import com.anthropic.models.messages.ContentBlock;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.TextBlock;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class FeedbackLoopServiceTest {

    @Mock
    private AnthropicClient anthropicClient;

    private FeedbackLoopService service;

    @BeforeEach
    void setUp() {
        service = new FeedbackLoopService(anthropicClient, new ObjectMapper(), "claude-haiku-4-5-20251001");
    }

    @Test
    @DisplayName("run — 첫 평가에서 80점 이상이면 1회차에 수렴한다")
    void run_convergesImmediately_whenScoreAboveThreshold() {
        // given
        MessageService messageService = mock(MessageService.class);
        given(anthropicClient.messages()).willReturn(messageService);

        String evalJson = "{\"score\": 85, \"suggestions\": [\"좋은 글입니다\"]}";
        Message evalMsg = mockMessage(evalJson);
        given(messageService.create(any(MessageCreateParams.class)))
                .willReturn(evalMsg);

        FeedbackRequest request = new FeedbackRequest("잘 작성된 글입니다.", 3);

        // when
        FeedbackResponse response = service.run(request);

        // then
        assertThat(response.converged()).isTrue();
        assertThat(response.finalScore()).isEqualTo(85);
        assertThat(response.iterations()).hasSize(1);
    }

    @Test
    @DisplayName("run — 점수가 낮으면 maxIterations만큼 반복 후 종료한다")
    void run_iteratesUpToMaxIterations_whenScoreBelowThreshold() {
        // given
        MessageService messageService = mock(MessageService.class);
        given(anthropicClient.messages()).willReturn(messageService);

        String evalJson = "{\"score\": 50, \"suggestions\": [\"내용 보강\", \"문장 다듬기\"]}";
        String improvedText = "개선된 텍스트";

        Message evalMsg1 = mockMessage(evalJson);
        Message improveMsg1 = mockMessage(improvedText);
        Message evalMsg2 = mockMessage(evalJson);
        Message improveMsg2 = mockMessage(improvedText);
        given(messageService.create(any(MessageCreateParams.class)))
                .willReturn(evalMsg1)    // 1회차 평가
                .willReturn(improveMsg1) // 1회차 개선
                .willReturn(evalMsg2)    // 2회차 평가
                .willReturn(improveMsg2); // 2회차 개선

        FeedbackRequest request = new FeedbackRequest("부족한 글입니다.", 2);

        // when
        FeedbackResponse response = service.run(request);

        // then
        assertThat(response.converged()).isFalse();
        assertThat(response.iterations()).hasSize(2);
        assertThat(response.finalScore()).isEqualTo(50);
    }

    @Test
    @DisplayName("run — 평가 JSON 파싱 실패 시 기본 점수(50)로 처리한다")
    void run_usesDefaultScore_whenParsingFails() {
        // given
        MessageService messageService = mock(MessageService.class);
        given(anthropicClient.messages()).willReturn(messageService);

        Message invalidMsg = mockMessage("invalid json");
        Message improvedMsg = mockMessage("개선된 텍스트");
        given(messageService.create(any(MessageCreateParams.class)))
                .willReturn(invalidMsg)    // 평가 파싱 실패
                .willReturn(improvedMsg);  // 개선

        FeedbackRequest request = new FeedbackRequest("테스트 글", 1);

        // when
        FeedbackResponse response = service.run(request);

        // then — 기본값 50점, 예외 없음
        assertThat(response.finalScore()).isEqualTo(50);
        assertThat(response.iterations()).hasSize(1);
    }

    private Message mockMessage(String text) {
        TextBlock textBlock = new TextBlock.Builder()
                .text(text)
                .citations(List.of())
                .build();
        ContentBlock block = ContentBlock.Companion.ofText(textBlock);
        Message message = mock(Message.class);
        given(message.content()).willReturn(List.of(block));
        return message;
    }
}
