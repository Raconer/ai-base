package com.aibase.domain.user.dto;

import com.aibase.domain.post.dto.PostSummaryResponse;
import com.aibase.domain.user.entity.User;

import java.util.List;

public record PublicProfileResponse(
        String username,
        String name,
        String bio,
        String avatarUrl,
        List<PostSummaryResponse> recentPosts
) {
    public static PublicProfileResponse of(User user, List<PostSummaryResponse> posts) {
        return new PublicProfileResponse(
                user.getUsername(),
                user.getName(),
                user.getBio(),
                user.getAvatarUrl(),
                posts
        );
    }
}
