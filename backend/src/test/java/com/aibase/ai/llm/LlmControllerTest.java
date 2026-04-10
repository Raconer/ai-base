package com.aibase.ai.llm;

import com.aibase.ai.llm.dto.LlmCorrectRequest;
import com.aibase.ai.llm.dto.LlmResponse;
import com.aibase.ai.llm.dto.LlmSummarizeRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LlmController.class)
class LlmControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LlmService llmService;

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/llm/correct — 200 반환")
    void correct_returns200() throws Exception {
        given(llmService.correctPost(any())).willReturn(new LlmResponse("교정된 글", "claude-haiku-4-5-20251001", 100, 80));

        LlmCorrectRequest request = new LlmCorrectRequest("교정할 글입니다.", "natural");

        mockMvc.perform(post("/api/ai/llm/correct")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.result").value("교정된 글"))
                .andExpect(jsonPath("$.data.inputTokens").value(100));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/llm/correct — text 비어있으면 400 반환")
    void correct_returns400_whenTextBlank() throws Exception {
        LlmCorrectRequest request = new LlmCorrectRequest("", "natural");

        mockMvc.perform(post("/api/ai/llm/correct")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/llm/summarize — 200 반환")
    void summarize_returns200() throws Exception {
        given(llmService.summarizeResume(any())).willReturn(new LlmResponse("요약된 내용", "claude-haiku-4-5-20251001", 200, 50));

        LlmSummarizeRequest request = new LlmSummarizeRequest("이력서 전문 내용입니다.", 200);

        mockMvc.perform(post("/api/ai/llm/summarize")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.result").value("요약된 내용"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/llm/evaluate — 200 반환")
    void evaluate_returns200() throws Exception {
        given(llmService.evaluatePost(anyString())).willReturn(new LlmResponse("{\"score\":85}", "claude-haiku-4-5-20251001", 150, 60));

        mockMvc.perform(post("/api/ai/llm/evaluate")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"평가할 글 내용입니다.\""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.outputTokens").value(60));
    }
}
