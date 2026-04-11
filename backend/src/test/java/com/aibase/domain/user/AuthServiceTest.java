package com.aibase.domain.user;

import com.aibase.common.exception.BusinessException;
import com.aibase.common.security.JwtTokenProvider;
import com.aibase.domain.user.dto.LoginRequest;
import com.aibase.domain.user.dto.RegisterRequest;
import com.aibase.domain.user.dto.TokenResponse;
import com.aibase.domain.user.entity.User;
import com.aibase.domain.user.entity.UserRole;
import com.aibase.domain.user.repository.UserRepository;
import com.aibase.domain.user.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private User savedUser;

    @BeforeEach
    void setUp() {
        savedUser = User.builder()
                .email("test@example.com")
                .passwordHash("encoded-password")
                .username("testuser")
                .name("테스트유저")
                .role(UserRole.USER)
                .build();
    }

    // ── register ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("register — 정상 가입 시 TokenResponse 반환")
    void register_success() {
        given(userRepository.existsByEmail("test@example.com")).willReturn(false);
        given(userRepository.existsByUsername("testuser")).willReturn(false);
        given(passwordEncoder.encode("password123")).willReturn("encoded-password");
        given(userRepository.save(any())).willReturn(savedUser);
        given(jwtTokenProvider.createAccessToken(any(), anyString(), anyString())).willReturn("access-token");
        given(jwtTokenProvider.createRefreshToken(any(), anyString(), anyString())).willReturn("refresh-token");

        RegisterRequest request = makeRegisterRequest("test@example.com", "password123", "testuser", "테스트유저");
        TokenResponse result = authService.register(request);

        assertThat(result.getAccessToken()).isEqualTo("access-token");
        assertThat(result.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(result.getUsername()).isEqualTo("testuser");
        assertThat(result.getRole()).isEqualTo("USER");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register — 이메일 중복 시 409 예외")
    void register_throws_whenEmailDuplicated() {
        given(userRepository.existsByEmail("test@example.com")).willReturn(true);

        RegisterRequest request = makeRegisterRequest("test@example.com", "password123", "testuser", "테스트유저");

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("이메일");
    }

    @Test
    @DisplayName("register — username 중복 시 409 예외")
    void register_throws_whenUsernameDuplicated() {
        given(userRepository.existsByEmail("test@example.com")).willReturn(false);
        given(userRepository.existsByUsername("testuser")).willReturn(true);

        RegisterRequest request = makeRegisterRequest("test@example.com", "password123", "testuser", "테스트유저");

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("username");
    }

    // ── login ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login — 정상 로그인 시 TokenResponse 반환")
    void login_success() {
        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(savedUser));
        given(passwordEncoder.matches("password123", "encoded-password")).willReturn(true);
        given(jwtTokenProvider.createAccessToken(any(), anyString(), anyString())).willReturn("access-token");
        given(jwtTokenProvider.createRefreshToken(any(), anyString(), anyString())).willReturn("refresh-token");

        LoginRequest request = makeLoginRequest("test@example.com", "password123");
        TokenResponse result = authService.login(request);

        assertThat(result.getAccessToken()).isEqualTo("access-token");
        assertThat(result.getUsername()).isEqualTo("testuser");
    }

    @Test
    @DisplayName("login — 존재하지 않는 이메일 시 401 예외")
    void login_throws_whenEmailNotFound() {
        given(userRepository.findByEmail("notfound@example.com")).willReturn(Optional.empty());

        LoginRequest request = makeLoginRequest("notfound@example.com", "password123");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    @DisplayName("login — 비밀번호 불일치 시 401 예외")
    void login_throws_whenPasswordMismatch() {
        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(savedUser));
        given(passwordEncoder.matches("wrongpassword", "encoded-password")).willReturn(false);

        LoginRequest request = makeLoginRequest("test@example.com", "wrongpassword");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BusinessException.class);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private RegisterRequest makeRegisterRequest(String email, String password, String username, String name) {
        try {
            RegisterRequest req = new RegisterRequest();
            setField(req, "email", email);
            setField(req, "password", password);
            setField(req, "username", username);
            setField(req, "name", name);
            return req;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private LoginRequest makeLoginRequest(String email, String password) {
        try {
            LoginRequest req = new LoginRequest();
            setField(req, "email", email);
            setField(req, "password", password);
            return req;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void setField(Object obj, String fieldName, String value) throws Exception {
        var field = obj.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(obj, value);
    }
}
