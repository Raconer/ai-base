package com.aibase.ai.sentiment;

import com.aibase.ai.sentiment.dto.SentimentRequest;
import com.aibase.ai.sentiment.dto.SentimentResponse;
import com.aibase.common.dto.ApiResponse;
import com.aibase.common.exception.BusinessException;
import com.aibase.domain.post.entity.Post;
import com.aibase.domain.post.repository.PostRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/sentiment")
@RequiredArgsConstructor
@Tag(name = "AI - Sentiment Analysis", description = "Claude API 기반 감성 분석")
public class SentimentController {

    private final SentimentService sentimentService;
    private final PostRepository postRepository;

    @PostMapping("/analyze")
    @Operation(summary = "텍스트 감성 분석")
    public ResponseEntity<ApiResponse<SentimentResponse>> analyze(
            @Valid @RequestBody SentimentRequest request) {

        SentimentResponse response = sentimentService.analyze(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/post/{postId}")
    @Operation(summary = "게시글 감성 분석 및 점수 저장")
    public ResponseEntity<ApiResponse<SentimentResponse>> analyzePost(
            @PathVariable Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException("게시글을 찾을 수 없습니다", HttpStatus.NOT_FOUND));

        SentimentResponse response = sentimentService.analyze(new SentimentRequest(post.getContent()));

        // sentiment_score 업데이트 (Post 엔티티에 메서드 추가 필요 — 현재는 반환만)
        return ResponseEntity.ok(ApiResponse.ok("감성 분석이 완료되었습니다", response));
    }
}
