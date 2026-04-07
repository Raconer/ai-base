package com.aibase.domain.post.dto;

import com.aibase.domain.post.entity.Post;

import java.time.LocalDateTime;
import java.util.List;

public record PostSummaryResponse(
        Long id,
        String title,
        String status,
        String category,
        Integer viewCount,
        List<String> tags,
        LocalDateTime createdAt
) {
    public static PostSummaryResponse from(Post post) {
        return new PostSummaryResponse(
                post.getId(),
                post.getTitle(),
                post.getStatus().name(),
                post.getCategory(),
                post.getViewCount(),
                post.getPostTags().stream()
                        .map(pt -> pt.getTag().getName())
                        .toList(),
                post.getCreatedAt()
        );
    }
}
