package com.aibase.domain.resume.entity;

import com.aibase.common.entity.BaseEntity;
import com.aibase.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "resumes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Resume extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> skills;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> experience;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> education;

    private String pdfUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isPrimary = false;

    public void update(String title, String summary,
                       Map<String, Object> skills,
                       Map<String, Object> experience,
                       Map<String, Object> education) {
        if (title != null) this.title = title;
        if (summary != null) this.summary = summary;
        if (skills != null) this.skills = skills;
        if (experience != null) this.experience = experience;
        if (education != null) this.education = education;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public void markAsPrimary() {
        this.isPrimary = true;
    }

    public void unmarkAsPrimary() {
        this.isPrimary = false;
    }
}
