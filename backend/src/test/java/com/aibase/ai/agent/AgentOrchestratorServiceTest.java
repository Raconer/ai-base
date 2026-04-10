package com.aibase.ai.agent;

import com.aibase.ai.agent.dto.AgentRequest;
import com.aibase.ai.agent.dto.AgentResponse;
import com.anthropic.client.AnthropicClient;
import com.anthropic.services.blocking.MessageService;
import com.anthropic.models.messages.ContentBlock;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.TextBlock;
// ContentBlock.Companion is accessed via Kotlin companion object
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
class AgentOrchestratorServiceTest {

    @Mock
    private AnthropicClient anthropicClient;

    private AgentOrchestratorService service;

    @BeforeEach
    void setUp() {
        service = new AgentOrchestratorService(anthropicClient, new ObjectMapper(), "claude-haiku-4-5-20251001");
    }

    @Test
    @DisplayName("classify — 3단계 에이전트가 순서대로 실행되고 결과를 반환한다")
    void classify_returnsCategoryTagsSummary() {
        // given
        MessageService messageService = mock(MessageService.class);
        given(anthropicClient.messages()).willReturn(messageService);

        Message classifyMsg = mockMessage("{\"category\": \"tech\"}");
        Message tagMsg = mockMessage("{\"tags\": [\"spring\", \"java\", \"api\", \"backend\", \"rest\"]}");
        Message summaryMsg = mockMessage("Spring Boot 기반 REST API 구현 방법을 다룹니다.");

        given(messageService.create(any(MessageCreateParams.class)))
                .willReturn(classifyMsg)
                .willReturn(tagMsg)
                .willReturn(summaryMsg);

        AgentRequest request = new AgentRequest("Spring Boot로 REST API를 만드는 방법에 대한 글입니다.", null);

        // when
        AgentResponse response = service.classify(request);

        // then
        assertThat(response.category()).isEqualTo("tech");
        assertThat(response.tags()).containsExactly("spring", "java", "api", "backend", "rest");
        assertThat(response.summary()).isNotBlank();
        assertThat(response.steps()).hasSize(3);
        assertThat(response.steps()).extracting("agentName")
                .containsExactly("분류 에이전트", "태그 에이전트", "요약 에이전트");
    }

    @Test
    @DisplayName("classify — Claude 응답이 파싱 실패해도 기본값으로 처리한다")
    void classify_fallbackOnParseError() {
        // given
        MessageService messageService = mock(MessageService.class);
        given(anthropicClient.messages()).willReturn(messageService);

        Message invalid1 = mockMessage("invalid json");
        Message invalid2 = mockMessage("invalid json");
        Message summaryFallback = mockMessage("요약 실패 시 그냥 텍스트");
        given(messageService.create(any(MessageCreateParams.class)))
                .willReturn(invalid1)
                .willReturn(invalid2)
                .willReturn(summaryFallback);

        AgentRequest request = new AgentRequest("테스트 텍스트", null);

        // when
        AgentResponse response = service.classify(request);

        // then — 파싱 실패 시 기본값 반환, 예외 없음
        assertThat(response.category()).isEqualTo("other");
        assertThat(response.tags()).contains("general");
        assertThat(response.steps()).hasSize(3);
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
