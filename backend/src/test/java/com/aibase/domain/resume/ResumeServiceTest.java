package com.aibase.domain.resume;

import com.aibase.common.exception.BusinessException;
import com.aibase.domain.resume.dto.ResumeRequest;
import com.aibase.domain.resume.dto.ResumeResponse;
import com.aibase.domain.resume.entity.Resume;
import com.aibase.domain.resume.repository.ResumeRepository;
import com.aibase.domain.resume.service.ResumeService;
import com.aibase.domain.user.entity.User;
import com.aibase.domain.user.entity.UserRole;
import com.aibase.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ResumeServiceTest {

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ResumeService resumeService;

    private User user;
    private Resume resume;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .email("test@example.com")
                .passwordHash("hash")
                .username("testuser")
                .name("테스트유저")
                .role(UserRole.USER)
                .build();

        resume = Resume.builder()
                .user(user)
                .title("내 이력서")
                .summary("백엔드 개발자")
                .skills(Map.of("java", "고급"))
                .experience(Map.of())
                .education(Map.of())
                .isPrimary(false)
                .build();
    }

    // ── getMyResumes ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("getMyResumes — 내 이력서 목록 반환")
    void getMyResumes_returnsListOfResumes() {
        given(resumeRepository.findByUserId(1L)).willReturn(List.of(resume));

        List<ResumeResponse> result = resumeService.getMyResumes(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("내 이력서");
    }

    @Test
    @DisplayName("getMyResumes — 이력서 없으면 빈 리스트 반환")
    void getMyResumes_returnsEmpty_whenNoResumes() {
        given(resumeRepository.findByUserId(1L)).willReturn(List.of());

        List<ResumeResponse> result = resumeService.getMyResumes(1L);

        assertThat(result).isEmpty();
    }

    // ── getResume ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getResume — 존재하는 id 조회 성공")
    void getResume_success() {
        given(resumeRepository.findById(1L)).willReturn(Optional.of(resume));

        ResumeResponse result = resumeService.getResume(1L);

        assertThat(result.title()).isEqualTo("내 이력서");
    }

    @Test
    @DisplayName("getResume — 없는 id 조회 시 예외")
    void getResume_throws_whenNotFound() {
        given(resumeRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> resumeService.getResume(99L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("이력서를 찾을 수 없습니다");
    }

    // ── create ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("create — 정상 생성 시 ResumeResponse 반환")
    void create_success() {
        given(userRepository.findById(1L)).willReturn(Optional.of(user));
        given(resumeRepository.save(any())).willReturn(resume);

        ResumeRequest request = new ResumeRequest("내 이력서", "백엔드", Map.of(), Map.of(), Map.of(), false);
        ResumeResponse result = resumeService.create(1L, request);

        assertThat(result.title()).isEqualTo("내 이력서");
        verify(resumeRepository).save(any(Resume.class));
    }

    @Test
    @DisplayName("create — 사용자 없으면 예외")
    void create_throws_whenUserNotFound() {
        given(userRepository.findById(99L)).willReturn(Optional.empty());

        ResumeRequest request = new ResumeRequest("제목", "요약", Map.of(), Map.of(), Map.of(), false);

        assertThatThrownBy(() -> resumeService.create(99L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("사용자를 찾을 수 없습니다");
    }

    // ── delete ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("delete — 없는 이력서 삭제 시도 시 예외")
    void delete_throws_whenResumeNotFound() {
        given(resumeRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> resumeService.delete(1L, 99L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("이력서를 찾을 수 없습니다");
    }

    // ── getPrimary ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getPrimary — 대표 이력서 없으면 예외")
    void getPrimary_throws_whenNoPrimary() {
        given(resumeRepository.findByUserIdAndIsPrimaryTrue(1L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> resumeService.getPrimary(1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("대표 이력서가 없습니다");
    }
}
