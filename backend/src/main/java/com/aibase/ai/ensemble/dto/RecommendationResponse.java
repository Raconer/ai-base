package com.aibase.ai.ensemble.dto;

import java.util.List;

public record RecommendationResponse(
        List<PostRecommendation> recommendations,
        String strategy  // "content_based" | "popular" | "ensemble"
) {
    public record PostRecommendation(
            Long postId,
            String title,
            String category,
            double score,
            String reason
    ) {}
}
