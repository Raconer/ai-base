package com.aibase.ai.sentiment.dto;

public record SentimentResponse(
        String label,       // "POSITIVE" | "NEGATIVE" | "NEUTRAL"
        double score,       // 0.0 ~ 1.0 (해당 레이블 신뢰도)
        double positive,    // 긍정 점수
        double negative,    // 부정 점수
        double neutral,     // 중립 점수
        String summary      // 한줄 평가
) {}
