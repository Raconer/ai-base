package com.aibase.ai.vectorsearch;

import com.aibase.ai.vectorsearch.dto.SemanticSearchRequest;
import com.aibase.ai.vectorsearch.dto.SemanticSearchResult;
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
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VectorSearchController.class)
class VectorSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VectorSearchService vectorSearchService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/vector/search — 200 반환 및 결과 포함")
    void search_returns200() throws Exception {
        List<SemanticSearchResult> mockResults = List.of(
                new SemanticSearchResult(1L, "resume.pdf", 0, "Java Spring Boot 경력 3년", 0.92, 1L, null, "resume"),
                new SemanticSearchResult(2L, "portfolio.pdf", 1, "React 프론트엔드 개발", 0.87, null, 1L, "post")
        );
        given(vectorSearchService.search(any())).willReturn(mockResults);

        SemanticSearchRequest request = new SemanticSearchRequest("Spring Boot 개발자", 5, null);

        mockMvc.perform(post("/api/ai/vector/search")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].similarity").value(0.92))
                .andExpect(jsonPath("$.data[0].type").value("resume"))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/vector/search — query 비어있으면 400 반환")
    void search_returns400_whenQueryBlank() throws Exception {
        SemanticSearchRequest request = new SemanticSearchRequest("", 5, null);

        mockMvc.perform(post("/api/ai/vector/search")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/ai/vector/index/{documentId} — 200 반환")
    void indexDocument_returns200() throws Exception {
        doNothing().when(vectorSearchService).indexDocument(1L);

        mockMvc.perform(post("/api/ai/vector/index/1")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
