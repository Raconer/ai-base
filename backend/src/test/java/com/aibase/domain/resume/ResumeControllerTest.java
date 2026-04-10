package com.aibase.domain.resume;

import com.aibase.common.security.JwtTokenProvider;
import com.aibase.common.security.JwtUserDetails;
import com.aibase.domain.resume.controller.ResumeController;
import com.aibase.domain.resume.dto.ResumeRequest;
import com.aibase.domain.resume.dto.ResumeResponse;
import com.aibase.domain.resume.service.ResumeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResumeController.class)
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResumeService resumeService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private JwtUserDetails mockUser() {
        return new JwtUserDetails(1L, "test@example.com",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }

    private ResumeResponse sampleResume() {
        return new ResumeResponse(1L, 1L, "내 이력서", "백엔드 개발자",
                Map.of("java", "고급"), Map.of(), Map.of(),
                null, false, LocalDateTime.now(), LocalDateTime.now());
    }

    @Test
    @DisplayName("GET /api/resumes — 내 이력서 목록 200 반환")
    void getMyResumes_returns200() throws Exception {
        given(resumeService.getMyResumes(any())).willReturn(List.of(sampleResume()));

        mockMvc.perform(get("/api/resumes").with(user(mockUser())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/resumes/{id} — 200 반환")
    void getResume_returns200() throws Exception {
        given(resumeService.getResume(1L)).willReturn(sampleResume());

        mockMvc.perform(get("/api/resumes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("내 이력서"));
    }

    @Test
    @DisplayName("POST /api/resumes — 201 반환")
    void createResume_returns201() throws Exception {
        given(resumeService.create(any(), any())).willReturn(sampleResume());

        var request = new ResumeRequest("내 이력서", "백엔드 개발자", Map.of(), Map.of(), Map.of(), false);

        mockMvc.perform(post("/api/resumes")
                        .with(user(mockUser())).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("POST /api/resumes — 제목 누락 시 400 반환")
    void createResume_returns400_whenTitleBlank() throws Exception {
        var request = new ResumeRequest("", "요약", Map.of(), Map.of(), Map.of(), false);

        mockMvc.perform(post("/api/resumes")
                        .with(user(mockUser())).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/resumes/{id} — 200 반환")
    void deleteResume_returns200() throws Exception {
        doNothing().when(resumeService).delete(any(), eq(1L));

        mockMvc.perform(delete("/api/resumes/1")
                        .with(user(mockUser())).with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("PATCH /api/resumes/{id}/primary — 200 반환")
    void setPrimary_returns200() throws Exception {
        var primaryResume = new ResumeResponse(1L, 1L, "내 이력서", "요약",
                Map.of(), Map.of(), Map.of(), null, true, LocalDateTime.now(), LocalDateTime.now());
        given(resumeService.setPrimary(any(), eq(1L))).willReturn(primaryResume);

        mockMvc.perform(patch("/api/resumes/1/primary")
                        .with(user(mockUser())).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isPrimary").value(true));
    }
}
