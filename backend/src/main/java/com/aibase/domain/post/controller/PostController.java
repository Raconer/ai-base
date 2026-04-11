package com.aibase.domain.post.controller;

import com.aibase.common.dto.ApiResponse;
import com.aibase.common.dto.PageResponse;
import com.aibase.common.security.JwtUserDetails;
import com.aibase.domain.post.dto.PostRequest;
import com.aibase.domain.post.dto.PostResponse;
import com.aibase.domain.post.dto.PostSummaryResponse;
import com.aibase.domain.post.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Posts", description = "게시글 API")
public class PostController {

    private final PostService postService;

    @GetMapping
    @Operation(summary = "게시글 목록 조회")
    public ResponseEntity<ApiResponse<PageResponse<PostSummaryResponse>>> getPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(postService.getPosts(category, username, pageable)));
    }

    @GetMapping("/search")
    @Operation(summary = "게시글 검색")
    public ResponseEntity<ApiResponse<PageResponse<PostSummaryResponse>>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(postService.searchPosts(keyword, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "게시글 상세 조회")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(postService.getPost(id)));
    }

    @PostMapping
    @Operation(summary = "게시글 작성")
    public ResponseEntity<ApiResponse<PostResponse>> create(
            @AuthenticationPrincipal JwtUserDetails userDetails,
            @Valid @RequestBody PostRequest request) {

        PostResponse response = postService.create(userDetails.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("게시글이 작성되었습니다", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "게시글 수정")
    public ResponseEntity<ApiResponse<PostResponse>> update(
            @AuthenticationPrincipal JwtUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request) {

        PostResponse response = postService.update(userDetails.getUserId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("게시글이 수정되었습니다", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "게시글 삭제")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal JwtUserDetails userDetails,
            @PathVariable Long id) {

        postService.delete(userDetails.getUserId(), id);
        return ResponseEntity.ok(ApiResponse.ok("게시글이 삭제되었습니다"));
    }

    @GetMapping("/my")
    @Operation(summary = "내 게시글 목록")
    public ResponseEntity<ApiResponse<PageResponse<PostSummaryResponse>>> getMyPosts(
            @AuthenticationPrincipal JwtUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(postService.getMyPosts(userDetails.getUserId(), pageable)));
    }
}
