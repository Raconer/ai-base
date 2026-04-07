package com.aibase.domain.pdf.repository;

import com.aibase.domain.pdf.entity.PdfDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PdfDocumentRepository extends JpaRepository<PdfDocument, Long> {

    List<PdfDocument> findByResumeIdOrderByChunkIndex(Long resumeId);

    List<PdfDocument> findByPostIdOrderByChunkIndex(Long postId);

    void deleteByResumeId(Long resumeId);

    void deleteByPostId(Long postId);
}
