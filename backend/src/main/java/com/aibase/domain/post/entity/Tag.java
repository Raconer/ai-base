package com.aibase.domain.post.entity;

import com.aibase.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tags")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Tag extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    private String category;

    @Column(nullable = false)
    @Builder.Default
    private Boolean aiGenerated = false;
}
