package com.aibase.domain.resume.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public record ResumeRequest(
        @NotBlank(message = "제목은 필수입니다")
        String title,

        String summary,

        Map<String, Object> skills,

        Map<String, Object> experience,

        Map<String, Object> education,

        Boolean isPrimary
) {}
