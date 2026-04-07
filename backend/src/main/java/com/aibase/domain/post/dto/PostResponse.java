package com.aibase.domain.post.dto;

import com.aibase.domain.post.entity.Post;

import java.time.LocalDateTime;
import java.util.List;

public record PostResponse(
        Long id,
        String title,
        String content,
        String status,
        String category,
        Double sentimentScore,
        Boolean aiCorrected,
        Integer viewCount,
        Long userId,
        String userName,
        List<String> tags,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getStatus().name(),
                post.getCategory(),
                post.getSentimentScore(),
                post.getAiCorrected(),
                post.getViewCount(),
                post.getUser().getId(),
                post.getUser().getName(),
                post.getPostTags().stream()
                        .map(pt -> pt.getTag().getName())
                        .toList(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
