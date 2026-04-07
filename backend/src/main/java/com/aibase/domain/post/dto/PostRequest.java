package com.aibase.domain.post.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record PostRequest(
        @NotBlank(message = "제목은 필수입니다")
        String title,

        @NotBlank(message = "내용은 필수입니다")
        String content,

        String category,

        String status,

        List<String> tags
) {}
