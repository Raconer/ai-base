package com.aibase.domain.resume.controller;

import com.aibase.common.dto.ApiResponse;
import com.aibase.common.security.JwtUserDetails;
import com.aibase.domain.resume.dto.ResumeRequest;
import com.aibase.domain.resume.dto.ResumeResponse;
import com.aibase.domain.resume.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Tag(name = "Resumes", description = "이력서 API")
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    @Operation(summary = "내 이력서 목록")
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> getMyResumes(
            @AuthenticationPrincipal JwtUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(resumeService.getMyResumes(userDetails.getUserId())));
    }

    @GetMapping("/primary")
    @Operation(summary = "대표 이력서 조회")
    public ResponseEntity<ApiResponse<ResumeResponse>> getPrimary(
            @AuthenticationPrincipal JwtUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(resumeService.getPrimary(userDetails.getUserId())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "이력서 상세 조회")
    public ResponseEntity<ApiResponse<ResumeResponse>> getResume(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(resumeService.getResume(id)));
    }

    @PostMapping
    @Operation(summary = "이력서 생성")
    public ResponseEntity<ApiResponse<ResumeResponse>> create(
            @AuthenticationPrincipal JwtUserDetails userDetails,
            @Valid @RequestBody ResumeRequest request) {

        ResumeResponse response = resumeService.create(userDetails.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("이력서가 생성되었습니다", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "이력서 수정")
    public ResponseEntity<ApiResponse<ResumeResponse>> update(
            @AuthenticationPrincipal JwtUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ResumeRequest request) {

        ResumeResponse response = resumeService.update(userDetails.getUserId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("이력서가 수정되었습니다", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "이력서 삭제")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal JwtUserDetails userDetails,
            @PathVariable Long id) {

        resumeService.delete(userDetails.getUserId(), id);
        return ResponseEntity.ok(ApiResponse.ok("이력서가 삭제되었습니다"));
    }

    @PatchMapping("/{id}/primary")
    @Operation(summary = "대표 이력서 설정")
    public ResponseEntity<ApiResponse<ResumeResponse>> setPrimary(
            @AuthenticationPrincipal JwtUserDetails userDetails,
            @PathVariable Long id) {

        ResumeResponse response = resumeService.setPrimary(userDetails.getUserId(), id);
        return ResponseEntity.ok(ApiResponse.ok("대표 이력서로 설정되었습니다", response));
    }
}
