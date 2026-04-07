package com.aibase.domain.pdf.dto;

import com.aibase.domain.pdf.entity.PdfDocument;

import java.time.LocalDateTime;

public record PdfDocumentResponse(
        Long id,
        String filename,
        Integer chunkIndex,
        String chunkText,
        Long resumeId,
        Long postId,
        LocalDateTime createdAt
) {
    public static PdfDocumentResponse from(PdfDocument doc) {
        return new PdfDocumentResponse(
                doc.getId(),
                doc.getFilename(),
                doc.getChunkIndex(),
                doc.getChunkText(),
                doc.getResume() != null ? doc.getResume().getId() : null,
                doc.getPost() != null ? doc.getPost().getId() : null,
                doc.getCreatedAt()
        );
    }
}
