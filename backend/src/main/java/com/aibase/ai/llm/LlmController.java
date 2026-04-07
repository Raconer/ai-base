package com.aibase.ai.llm;

import com.aibase.ai.llm.dto.LlmCorrectRequest;
import com.aibase.ai.llm.dto.LlmResponse;
import com.aibase.ai.llm.dto.LlmSummarizeRequest;
import com.aibase.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/llm")
@RequiredArgsConstructor
@Tag(name = "AI - LLM", description = "LLM API 연동 (글 교정, 이력서 요약)")
public class LlmController {

    private final LlmService llmService;

    @PostMapping("/correct")
    @Operation(summary = "글 AI 교정", description = "오타 수정, 문법 교정, 톤 개선")
    public ResponseEntity<ApiResponse<LlmResponse>> correctPost(
            @Valid @RequestBody LlmCorrectRequest request) {

        LlmResponse response = llmService.correctPost(request);
        return ResponseEntity.ok(ApiResponse.ok("글 교정이 완료되었습니다", response));
    }

    @PostMapping("/summarize")
    @Operation(summary = "이력서 요약", description = "이력서 핵심 내용 자동 요약")
    public ResponseEntity<ApiResponse<LlmResponse>> summarizeResume(
            @Valid @RequestBody LlmSummarizeRequest request) {

        LlmResponse response = llmService.summarizeResume(request);
        return ResponseEntity.ok(ApiResponse.ok("요약이 완료되었습니다", response));
    }

    @PostMapping("/evaluate")
    @Operation(summary = "글 품질 평가", description = "AI 기반 글 품질 점수 및 개선 제안")
    public ResponseEntity<ApiResponse<LlmResponse>> evaluatePost(
            @RequestBody String text) {

        LlmResponse response = llmService.evaluatePost(text);
        return ResponseEntity.ok(ApiResponse.ok("평가가 완료되었습니다", response));
    }
}
