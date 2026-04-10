package com.aibase.domain.user;

import com.aibase.common.security.JwtTokenProvider;
import com.aibase.domain.user.controller.AuthController;
import com.aibase.domain.user.dto.TokenResponse;
import com.aibase.domain.user.repository.UserRepository;
import com.aibase.domain.user.service.AuthService;
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

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private final TokenResponse tokenResponse = TokenResponse.builder()
            .accessToken("access-token")
            .refreshToken("refresh-token")
            .build();

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/register — 201 반환")
    void register_returns201() throws Exception {
        given(authService.register(any())).willReturn(tokenResponse);

        var request = new ObjectMapper().createObjectNode()
                .put("email", "test@example.com")
                .put("password", "password123")
                .put("name", "테스트유저");

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request.toString()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.accessToken").value("access-token"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/register — 이메일 누락 시 400 반환")
    void register_returns400_whenEmailMissing() throws Exception {
        var request = new ObjectMapper().createObjectNode()
                .put("password", "password123")
                .put("name", "테스트유저");

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request.toString()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/login — 200 반환")
    void login_returns200() throws Exception {
        given(authService.login(any())).willReturn(tokenResponse);

        var request = new ObjectMapper().createObjectNode()
                .put("email", "test@example.com")
                .put("password", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").value("access-token"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/login — 비밀번호 8자 미만 400 반환")
    void login_returns400_whenPasswordTooShort() throws Exception {
        var request = new ObjectMapper().createObjectNode()
                .put("email", "test@example.com")
                .put("password", "short");

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request.toString()))
                .andExpect(status().isBadRequest());
    }
}
