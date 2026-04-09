package com.aibase.ai.agent.dto;

import jakarta.validation.constraints.NotBlank;

public record AgentRequest(
        @NotBlank String text,
        Long postId  // nullable — 저장 에이전트가 태그 자동 적용할 때 사용
) {}
