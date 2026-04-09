package com.aibase.ai.feedback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record FeedbackRequest(
        @NotBlank String text,
        @Min(1) @Max(5) int maxIterations  // 피드백 루프 최대 반복 횟수 (기본 3)
) {}
