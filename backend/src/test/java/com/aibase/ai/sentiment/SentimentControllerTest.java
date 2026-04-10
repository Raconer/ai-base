package com.aibase.ai.sentiment;

import com.aibase.ai.sentiment.dto.SentimentRequest;
import com.aibase.ai.sentiment.dto.SentimentResponse;
import com.aibase.domain.post.repository.PostRepository;
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
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SentimentController.class)
class SentimentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SentimentService sentimentService;

    @MockBean
    private PostRepository postRepository;

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/sentiment/analyze — 200 반환")
    void analyze_returns200() throws Exception {
        SentimentResponse mockResponse = new SentimentResponse("POSITIVE", 0.85, 0.85, 0.10, 0.05, "긍정적인 글");
        given(sentimentService.analyze(any())).willReturn(mockResponse);

        SentimentRequest request = new SentimentRequest("오늘 정말 좋은 하루였습니다!");

        mockMvc.perform(post("/api/ai/sentiment/analyze")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.label").value("POSITIVE"))
                .andExpect(jsonPath("$.data.score").value(0.85));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/sentiment/analyze — text 비어있으면 400 반환")
    void analyze_returns400_whenTextBlank() throws Exception {
        SentimentRequest request = new SentimentRequest("");

        mockMvc.perform(post("/api/ai/sentiment/analyze")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/sentiment/post/{postId} — 존재하지 않는 게시글이면 404 반환")
    void analyzePost_returns404_whenPostNotFound() throws Exception {
        given(postRepository.findById(999L)).willReturn(java.util.Optional.empty());

        mockMvc.perform(post("/api/ai/sentiment/post/999")
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }
}
