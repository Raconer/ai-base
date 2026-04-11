package com.aibase.ai.feedback;

import com.aibase.ai.feedback.dto.FeedbackRequest;
import com.aibase.ai.feedback.dto.FeedbackResponse;
import com.aibase.common.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FeedbackController.class)
class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FeedbackLoopService feedbackService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/feedback/run — 정상 요청 시 200 반환")
    void run_returns200() throws Exception {
        FeedbackResponse mockResponse = new FeedbackResponse(
                "원문",
                "개선된 글",
                List.of(new FeedbackResponse.FeedbackIteration(1, 85, List.of("좋음"), "개선된 글")),
                85,
                true
        );
        given(feedbackService.run(any())).willReturn(mockResponse);

        FeedbackRequest request = new FeedbackRequest("테스트 글입니다.", 3);

        mockMvc.perform(post("/api/ai/feedback/run")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.converged").value(true))
                .andExpect(jsonPath("$.data.finalScore").value(85));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/feedback/run — text 비어있으면 400 반환")
    void run_returns400_whenTextBlank() throws Exception {
        FeedbackRequest request = new FeedbackRequest("", 3);

        mockMvc.perform(post("/api/ai/feedback/run")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/feedback/run — maxIterations 범위 초과 시 400 반환")
    void run_returns400_whenMaxIterationsOutOfRange() throws Exception {
        FeedbackRequest request = new FeedbackRequest("글 내용", 10);

        mockMvc.perform(post("/api/ai/feedback/run")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
