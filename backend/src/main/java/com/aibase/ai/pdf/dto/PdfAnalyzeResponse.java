package com.aibase.ai.pdf.dto;

public record PdfAnalyzeResponse(
        String analysisJson,  // Claude가 반환한 JSON 문자열 (summary, keywords, mainTopics)
        String type,          // "resume" | "post"
        int analyzedLength    // 분석한 텍스트 길이
) {}
