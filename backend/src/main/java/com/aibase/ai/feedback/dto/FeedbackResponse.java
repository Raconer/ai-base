package com.aibase.ai.feedback.dto;

import java.util.List;

public record FeedbackResponse(
        String originalText,
        String improvedText,
        List<FeedbackIteration> iterations,
        int finalScore,
        boolean converged
) {
    public record FeedbackIteration(
            int iteration,
            int score,
            List<String> suggestions,
            String improvedText
    ) {}
}
