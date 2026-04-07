package com.aibase.domain.pdf.entity;

import com.aibase.common.entity.BaseEntity;
import com.aibase.domain.post.entity.Post;
import com.aibase.domain.resume.entity.Resume;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pdf_documents")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PdfDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(nullable = false)
    private String filename;

    @Column(columnDefinition = "TEXT")
    private String originalText;

    private Integer chunkIndex;

    @Column(columnDefinition = "TEXT")
    private String chunkText;

    // pgvector embedding (1536차원) — 실제 벡터 타입은 AI feature 브랜치에서 활성화
    // @Column(columnDefinition = "vector(1536)")
    // private float[] embedding;

    public void updateChunk(int chunkIndex, String chunkText) {
        this.chunkIndex = chunkIndex;
        this.chunkText = chunkText;
    }
}
