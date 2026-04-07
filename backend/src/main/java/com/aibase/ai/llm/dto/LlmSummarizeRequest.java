package com.aibase.ai.llm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LlmSummarizeRequest(
        @NotBlank(message = "요약할 텍스트를 입력해주세요")
        @Size(max = 20000, message = "텍스트는 20,000자 이내여야 합니다")
        String text,

        int maxLength  // 요약 최대 길이 (단어 수), 0이면 기본값 200
) {}
