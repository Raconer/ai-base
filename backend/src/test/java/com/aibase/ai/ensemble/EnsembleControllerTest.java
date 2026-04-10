package com.aibase.ai.ensemble;

import com.aibase.ai.ensemble.dto.RecommendationResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EnsembleController.class)
class EnsembleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EnsemblePredictionService ensembleService;

    @Test
    @WithMockUser
    @DisplayName("GET /api/ai/ensemble/recommend/post/{postId} — 200 반환")
    void recommendByPost_returns200() throws Exception {
        RecommendationResponse mockResponse = new RecommendationResponse(
                List.of(
                        new RecommendationResponse.PostRecommendation(2L, "Spring Boot 가이드", "tech", 0.91, "같은 카테고리"),
                        new RecommendationResponse.PostRecommendation(3L, "JPA 심화", "tech", 0.87, "높은 조회수")
                ),
                "ensemble"
        );
        given(ensembleService.recommend(anyLong(), anyInt())).willReturn(mockResponse);

        mockMvc.perform(get("/api/ai/ensemble/recommend/post/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.strategy").value("ensemble"))
                .andExpect(jsonPath("$.data.recommendations[0].score").value(0.91))
                .andExpect(jsonPath("$.data.recommendations").isArray());
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/ai/ensemble/recommend/popular — 200 반환")
    void popular_returns200() throws Exception {
        RecommendationResponse mockResponse = new RecommendationResponse(
                List.of(
                        new RecommendationResponse.PostRecommendation(1L, "인기 글", "general", 0.95, "높은 조회수")
                ),
                "popular"
        );
        given(ensembleService.popularRecommend(anyInt())).willReturn(mockResponse);

        mockMvc.perform(get("/api/ai/ensemble/recommend/popular"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.strategy").value("popular"))
                .andExpect(jsonPath("$.data.recommendations[0].title").value("인기 글"));
    }
}
