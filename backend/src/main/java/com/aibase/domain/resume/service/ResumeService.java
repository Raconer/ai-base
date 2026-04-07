package com.aibase.domain.resume.service;

import com.aibase.common.exception.BusinessException;
import com.aibase.domain.resume.dto.ResumeRequest;
import com.aibase.domain.resume.dto.ResumeResponse;
import com.aibase.domain.resume.entity.Resume;
import com.aibase.domain.resume.repository.ResumeRepository;
import com.aibase.domain.user.entity.User;
import com.aibase.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public List<ResumeResponse> getMyResumes(Long userId) {
        return resumeRepository.findByUserId(userId).stream()
                .map(ResumeResponse::from)
                .toList();
    }

    public ResumeResponse getResume(Long id) {
        return ResumeResponse.from(findById(id));
    }

    public ResumeResponse getPrimary(Long userId) {
        Resume resume = resumeRepository.findByUserIdAndIsPrimaryTrue(userId)
                .orElseThrow(() -> new BusinessException("대표 이력서가 없습니다", HttpStatus.NOT_FOUND));
        return ResumeResponse.from(resume);
    }

    @Transactional
    public ResumeResponse create(Long userId, ResumeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("사용자를 찾을 수 없습니다", HttpStatus.NOT_FOUND));

        if (Boolean.TRUE.equals(request.isPrimary())) {
            unsetCurrentPrimary(userId);
        }

        Resume resume = Resume.builder()
                .user(user)
                .title(request.title())
                .summary(request.summary())
                .skills(request.skills())
                .experience(request.experience())
                .education(request.education())
                .isPrimary(Boolean.TRUE.equals(request.isPrimary()))
                .build();

        return ResumeResponse.from(resumeRepository.save(resume));
    }

    @Transactional
    public ResumeResponse update(Long userId, Long resumeId, ResumeRequest request) {
        Resume resume = findById(resumeId);
        validateOwner(resume, userId);

        if (Boolean.TRUE.equals(request.isPrimary()) && !resume.getIsPrimary()) {
            unsetCurrentPrimary(userId);
            resume.markAsPrimary();
        }

        resume.update(request.title(), request.summary(),
                request.skills(), request.experience(), request.education());

        return ResumeResponse.from(resume);
    }

    @Transactional
    public void delete(Long userId, Long resumeId) {
        Resume resume = findById(resumeId);
        validateOwner(resume, userId);
        resumeRepository.delete(resume);
    }

    @Transactional
    public ResumeResponse setPrimary(Long userId, Long resumeId) {
        unsetCurrentPrimary(userId);
        Resume resume = findById(resumeId);
        validateOwner(resume, userId);
        resume.markAsPrimary();
        return ResumeResponse.from(resume);
    }

    private Resume findById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("이력서를 찾을 수 없습니다", HttpStatus.NOT_FOUND));
    }

    private void validateOwner(Resume resume, Long userId) {
        if (!resume.getUser().getId().equals(userId)) {
            throw new BusinessException("권한이 없습니다", HttpStatus.FORBIDDEN);
        }
    }

    private void unsetCurrentPrimary(Long userId) {
        resumeRepository.findByUserIdAndIsPrimaryTrue(userId)
                .ifPresent(Resume::unmarkAsPrimary);
    }
}
