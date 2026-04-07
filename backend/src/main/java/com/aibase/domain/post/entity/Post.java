package com.aibase.domain.post.entity;

import com.aibase.common.entity.BaseEntity;
import com.aibase.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Post extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PostStatus status = PostStatus.DRAFT;

    private String category;

    private Double sentimentScore;

    @Column(nullable = false)
    @Builder.Default
    private Boolean aiCorrected = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PostTag> postTags = new ArrayList<>();

    public void update(String title, String content, String category, PostStatus status) {
        if (title != null) this.title = title;
        if (content != null) this.content = content;
        if (category != null) this.category = category;
        if (status != null) this.status = status;
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void clearTags() {
        this.postTags.clear();
    }

    public void addPostTag(PostTag postTag) {
        this.postTags.add(postTag);
    }
}
