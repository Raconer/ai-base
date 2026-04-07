package com.aibase.domain.user.dto;

import com.aibase.domain.user.entity.User;
import com.aibase.domain.user.entity.UserRole;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponse {

    private final Long id;
    private final String email;
    private final String name;
    private final UserRole role;
    private final String bio;
    private final String avatarUrl;
    private final LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
