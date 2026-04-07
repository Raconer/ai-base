package com.aibase.domain.resume.dto;

import com.aibase.domain.resume.entity.Resume;

import java.time.LocalDateTime;
import java.util.Map;

public record ResumeResponse(
        Long id,
        Long userId,
        String title,
        String summary,
        Map<String, Object> skills,
        Map<String, Object> experience,
        Map<String, Object> education,
        String pdfUrl,
        Boolean isPrimary,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ResumeResponse from(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getUser().getId(),
                resume.getTitle(),
                resume.getSummary(),
                resume.getSkills(),
                resume.getExperience(),
                resume.getEducation(),
                resume.getPdfUrl(),
                resume.getIsPrimary(),
                resume.getCreatedAt(),
                resume.getUpdatedAt()
        );
    }
}
