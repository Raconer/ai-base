package com.aibase.domain.post;

import com.aibase.common.dto.PageResponse;
import com.aibase.common.security.JwtTokenProvider;
import com.aibase.common.security.JwtUserDetails;
import com.aibase.domain.post.controller.PostController;
import com.aibase.domain.post.dto.PostRequest;
import com.aibase.domain.post.dto.PostResponse;
import com.aibase.domain.post.dto.PostSummaryResponse;
import com.aibase.domain.post.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PostService postService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private JwtUserDetails mockUser() {
        return new JwtUserDetails(1L, "test@example.com",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }

    private PostResponse samplePost() {
        return new PostResponse(1L, "테스트 제목", "테스트 내용", "PUBLISHED",
                "tech", null, false, 0, 1L, "테스터",
                List.of("java"), LocalDateTime.now(), LocalDateTime.now());
    }

    private PostSummaryResponse sampleSummary() {
        return new PostSummaryResponse(1L, "테스트 제목", "PUBLISHED", "tech",
                0, List.of("java"), LocalDateTime.now());
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/posts — 200 반환")
    void getPosts_returns200() throws Exception {
        var page = new PageImpl<>(List.of(sampleSummary()), PageRequest.of(0, 10), 1);
        given(postService.getPosts(any(), any())).willReturn(PageResponse.from(page));

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/posts/{id} — 200 반환")
    void getPost_returns200() throws Exception {
        given(postService.getPost(1L)).willReturn(samplePost());

        mockMvc.perform(get("/api/posts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("테스트 제목"));
    }

    @Test
    @DisplayName("POST /api/posts — 201 반환")
    void createPost_returns201() throws Exception {
        given(postService.create(any(), any())).willReturn(samplePost());

        var request = new PostRequest("테스트 제목", "테스트 내용", "tech", "PUBLISHED", List.of("java"));

        mockMvc.perform(post("/api/posts")
                        .with(user(mockUser())).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("POST /api/posts — 제목 누락 시 400 반환")
    void createPost_returns400_whenTitleBlank() throws Exception {
        var request = new PostRequest("", "내용", "tech", "PUBLISHED", List.of());

        mockMvc.perform(post("/api/posts")
                        .with(user(mockUser())).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/posts/{id} — 200 반환")
    void deletePost_returns200() throws Exception {
        doNothing().when(postService).delete(any(), eq(1L));

        mockMvc.perform(delete("/api/posts/1")
                        .with(user(mockUser())).with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/posts/search — 200 반환")
    void searchPosts_returns200() throws Exception {
        var page = new PageImpl<>(List.of(sampleSummary()), PageRequest.of(0, 10), 1);
        given(postService.searchPosts(eq("java"), any())).willReturn(PageResponse.from(page));

        mockMvc.perform(get("/api/posts/search").param("keyword", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }
}
