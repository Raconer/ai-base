package com.aibase.ai.llm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LlmCorrectRequest(
        @NotBlank(message = "교정할 텍스트를 입력해주세요")
        @Size(max = 10000, message = "텍스트는 10,000자 이내여야 합니다")
        String text,

        String tone  // "formal", "casual", "technical" (optional)
) {}
