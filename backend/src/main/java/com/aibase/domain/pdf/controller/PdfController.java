package com.aibase.domain.pdf.controller;

import com.aibase.common.dto.ApiResponse;
import com.aibase.domain.pdf.dto.PdfDocumentResponse;
import com.aibase.domain.pdf.dto.PdfUploadResponse;
import com.aibase.domain.pdf.service.PdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
@Tag(name = "PDF", description = "PDF 업로드 및 분석 API")
public class PdfController {

    private final PdfService pdfService;

    @PostMapping(value = "/resume/{resumeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "이력서용 PDF 업로드")
    public ResponseEntity<ApiResponse<PdfUploadResponse>> uploadForResume(
            @PathVariable Long resumeId,
            @RequestParam("file") MultipartFile file) {

        PdfUploadResponse response = pdfService.uploadForResume(resumeId, file);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping(value = "/post/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "게시글용 PDF 업로드")
    public ResponseEntity<ApiResponse<PdfUploadResponse>> uploadForPost(
            @PathVariable Long postId,
            @RequestParam("file") MultipartFile file) {

        PdfUploadResponse response = pdfService.uploadForPost(postId, file);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/resume/{resumeId}/chunks")
    @Operation(summary = "이력서 PDF 청크 목록")
    public ResponseEntity<ApiResponse<List<PdfDocumentResponse>>> getResumeChunks(
            @PathVariable Long resumeId) {

        return ResponseEntity.ok(ApiResponse.ok(pdfService.getChunksByResume(resumeId)));
    }

    @GetMapping("/post/{postId}/chunks")
    @Operation(summary = "게시글 PDF 청크 목록")
    public ResponseEntity<ApiResponse<List<PdfDocumentResponse>>> getPostChunks(
            @PathVariable Long postId) {

        return ResponseEntity.ok(ApiResponse.ok(pdfService.getChunksByPost(postId)));
    }
}
