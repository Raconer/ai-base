package com.aibase.domain.user;

import com.aibase.common.security.JwtTokenProvider;
import com.aibase.common.security.JwtUserDetails;
import com.aibase.domain.user.controller.AuthController;
import com.aibase.domain.user.dto.TokenResponse;
import com.aibase.domain.user.entity.User;
import com.aibase.domain.user.entity.UserRole;
import com.aibase.domain.user.repository.UserRepository;
import com.aibase.domain.user.service.AuthService;
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

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
            .id(1L)
            .email("test@example.com")
            .username("testuser")
            .name("테스트유저")
            .role("USER")
            .build();

    // ── register ──────────────────────────────────────────────────────────────

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/register — 유효한 요청 시 201 반환")
    void register_returns201() throws Exception {
        given(authService.register(any())).willReturn(tokenResponse);

        String body = objectMapper.createObjectNode()
                .put("email", "test@example.com")
                .put("password", "password123")
                .put("username", "testuser")
                .put("name", "테스트유저")
                .toString();

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("access-token"))
                .andExpect(jsonPath("$.data.username").value("testuser"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/register — 이메일 누락 시 400 반환")
    void register_returns400_whenEmailMissing() throws Exception {
        String body = objectMapper.createObjectNode()
                .put("password", "password123")
                .put("username", "testuser")
                .put("name", "테스트유저")
                .toString();

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/register — username 누락 시 400 반환")
    void register_returns400_whenUsernameMissing() throws Exception {
        String body = objectMapper.createObjectNode()
                .put("email", "test@example.com")
                .put("password", "password123")
                .put("name", "테스트유저")
                .toString();

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/register — 비밀번호 8자 미만 시 400 반환")
    void register_returns400_whenPasswordTooShort() throws Exception {
        String body = objectMapper.createObjectNode()
                .put("email", "test@example.com")
                .put("password", "short")
                .put("username", "testuser")
                .put("name", "테스트유저")
                .toString();

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/register — username 특수문자 포함 시 400 반환")
    void register_returns400_whenUsernameInvalid() throws Exception {
        String body = objectMapper.createObjectNode()
                .put("email", "test@example.com")
                .put("password", "password123")
                .put("username", "invalid user!")
                .put("name", "테스트유저")
                .toString();

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    // ── login ─────────────────────────────────────────────────────────────────

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/login — 유효한 요청 시 200 반환")
    void login_returns200() throws Exception {
        given(authService.login(any())).willReturn(tokenResponse);

        String body = objectMapper.createObjectNode()
                .put("email", "test@example.com")
                .put("password", "password123")
                .toString();

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("access-token"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/login — 비밀번호 8자 미만 시 400 반환")
    void login_returns400_whenPasswordTooShort() throws Exception {
        String body = objectMapper.createObjectNode()
                .put("email", "test@example.com")
                .put("password", "short")
                .toString();

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/auth/login — 이메일 형식 오류 시 400 반환")
    void login_returns400_whenEmailInvalid() throws Exception {
        String body = objectMapper.createObjectNode()
                .put("email", "not-an-email")
                .put("password", "password123")
                .toString();

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    // ── /me ───────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/auth/me — 인증된 사용자 정보 반환")
    void me_returnsUserInfo() throws Exception {
        User user = User.builder()
                .email("test@example.com")
                .passwordHash("hash")
                .username("testuser")
                .name("테스트유저")
                .role(UserRole.USER)
                .build();

        given(userRepository.findById(1L)).willReturn(Optional.of(user));

        JwtUserDetails jwtUserDetails = new JwtUserDetails(
                1L, "test@example.com",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        mockMvc.perform(get("/api/auth/me")
                        .with(user(jwtUserDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("testuser"));
    }
}
