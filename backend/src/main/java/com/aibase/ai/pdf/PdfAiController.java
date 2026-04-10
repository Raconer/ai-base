package com.aibase.ai.pdf;

import com.aibase.ai.pdf.dto.PdfAnalyzeResponse;
import com.aibase.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/pdf")
@Tag(name = "AI - PDF Analysis", description = "PDF 내용 AI 요약 및 키워드 추출")
public class PdfAiController {

    private final PdfAiService pdfAiService;

    public PdfAiController(PdfAiService pdfAiService) {
        this.pdfAiService = pdfAiService;
    }

    @PostMapping("/resume/{resumeId}/analyze")
    @Operation(summary = "이력서 PDF AI 분석", description = "업로드된 이력서 PDF를 요약하고 키워드를 추출합니다")
    public ResponseEntity<ApiResponse<PdfAnalyzeResponse>> analyzeResume(
            @PathVariable Long resumeId) {

        PdfAnalyzeResponse response = pdfAiService.analyzeResume(resumeId);
        return ResponseEntity.ok(ApiResponse.ok("이력서 PDF 분석이 완료되었습니다", response));
    }

    @PostMapping("/post/{postId}/analyze")
    @Operation(summary = "게시글 PDF AI 분석", description = "업로드된 게시글 첨부 PDF를 요약하고 키워드를 추출합니다")
    public ResponseEntity<ApiResponse<PdfAnalyzeResponse>> analyzePost(
            @PathVariable Long postId) {

        PdfAnalyzeResponse response = pdfAiService.analyzePost(postId);
        return ResponseEntity.ok(ApiResponse.ok("게시글 PDF 분석이 완료되었습니다", response));
    }
}
