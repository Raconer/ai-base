package com.aibase.ai.ensemble;

import com.aibase.ai.ensemble.dto.RecommendationResponse;
import com.aibase.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/ensemble")
@RequiredArgsConstructor
@Tag(name = "AI - Ensemble Prediction", description = "앙상블 콘텐츠 추천")
public class EnsembleController {

    private final EnsemblePredictionService ensembleService;

    @GetMapping("/recommend/post/{postId}")
    @Operation(summary = "게시글 기반 추천", description = "인기도 + 카테고리 앙상블 추천")
    public ResponseEntity<ApiResponse<RecommendationResponse>> recommendByPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "5") int topK) {

        return ResponseEntity.ok(ApiResponse.ok(ensembleService.recommend(postId, topK)));
    }

    @GetMapping("/recommend/popular")
    @Operation(summary = "인기글 추천")
    public ResponseEntity<ApiResponse<RecommendationResponse>> popular(
            @RequestParam(defaultValue = "5") int topK) {

        return ResponseEntity.ok(ApiResponse.ok(ensembleService.popularRecommend(topK)));
    }
}
