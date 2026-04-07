package com.aibase.ai.vectorsearch;

import com.aibase.ai.vectorsearch.dto.SemanticSearchRequest;
import com.aibase.ai.vectorsearch.dto.SemanticSearchResult;
import com.aibase.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai/vector")
@RequiredArgsConstructor
@Tag(name = "AI - Vector Search", description = "pgvector 기반 시맨틱 검색 + RAG")
public class VectorSearchController {

    private final VectorSearchService vectorSearchService;

    @PostMapping("/search")
    @Operation(summary = "시맨틱 검색", description = "쿼리와 의미적으로 유사한 PDF 청크를 검색")
    public ResponseEntity<ApiResponse<List<SemanticSearchResult>>> search(
            @Valid @RequestBody SemanticSearchRequest request) {

        List<SemanticSearchResult> results = vectorSearchService.search(request);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @PostMapping("/index/{documentId}")
    @Operation(summary = "문서 인덱싱", description = "PDF 문서를 벡터 인덱스에 추가")
    public ResponseEntity<ApiResponse<Void>> indexDocument(
            @PathVariable Long documentId) {

        vectorSearchService.indexDocument(documentId);
        return ResponseEntity.ok(ApiResponse.ok("문서가 인덱싱되었습니다"));
    }
}
