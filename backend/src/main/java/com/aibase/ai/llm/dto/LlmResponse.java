package com.aibase.ai.llm.dto;

public record LlmResponse(
        String result,
        String model,
        int inputTokens,
        int outputTokens
) {}
