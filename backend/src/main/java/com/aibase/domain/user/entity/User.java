package com.aibase.domain.user.entity;

import com.aibase.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String avatarUrl;

    @Builder
    public User(String email, String passwordHash, String username, String name, UserRole role,
                String bio, String avatarUrl) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.username = username;
        this.name = name;
        this.role = role != null ? role : UserRole.USER;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }
}
