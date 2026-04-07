package com.aibase.ai.vectorsearch.dto;

public record SemanticSearchResult(
        Long documentId,
        String filename,
        Integer chunkIndex,
        String chunkText,
        Double similarity,  // 코사인 유사도 (0~1)
        Long resumeId,
        Long postId,
        String type         // "resume" | "post"
) {}
