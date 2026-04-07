package com.aibase.ai.vectorsearch.dto;

import jakarta.validation.constraints.NotBlank;

public record SemanticSearchRequest(
        @NotBlank(message = "검색어를 입력해주세요")
        String query,

        int topK,       // 상위 몇 개 반환 (기본값 5)

        String type     // "resume" | "post" | null (전체)
) {}
