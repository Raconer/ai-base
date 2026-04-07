package com.aibase.ai.sentiment.dto;

import jakarta.validation.constraints.NotBlank;

public record SentimentRequest(
        @NotBlank(message = "분석할 텍스트를 입력해주세요")
        String text
) {}
