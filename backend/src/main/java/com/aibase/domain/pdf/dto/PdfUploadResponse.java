package com.aibase.domain.pdf.dto;

public record PdfUploadResponse(
        Long documentId,
        String filename,
        int chunkCount,
        String message
) {}
