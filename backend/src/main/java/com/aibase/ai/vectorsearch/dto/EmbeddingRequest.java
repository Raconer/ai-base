package com.aibase.ai.vectorsearch.dto;

import jakarta.validation.constraints.NotBlank;

public record EmbeddingRequest(
        @NotBlank(message = "임베딩할 텍스트를 입력해주세요")
        String text
) {}
