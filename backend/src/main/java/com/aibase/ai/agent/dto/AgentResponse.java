package com.aibase.ai.agent.dto;

import java.util.List;

public record AgentResponse(
        String category,
        List<String> tags,
        String summary,
        List<AgentStep> steps
) {
    public record AgentStep(
            String agentName,
            String input,
            String output,
            long durationMs
    ) {}
}
