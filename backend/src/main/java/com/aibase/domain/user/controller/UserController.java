package com.aibase.domain.user.controller;

import com.aibase.common.dto.ApiResponse;
import com.aibase.common.exception.BusinessException;
import com.aibase.domain.post.dto.PostSummaryResponse;
import com.aibase.domain.post.entity.PostStatus;
import com.aibase.domain.post.repository.PostRepository;
import com.aibase.domain.user.dto.PublicProfileResponse;
import com.aibase.domain.user.entity.User;
import com.aibase.domain.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "공개 프로필 조회")
public class UserController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @GetMapping("/{username}")
    @Operation(summary = "공개 프로필 조회", description = "username으로 공개 포트폴리오 프로필 조회")
    public ResponseEntity<ApiResponse<PublicProfileResponse>> getProfile(
            @PathVariable String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> BusinessException.notFound("존재하지 않는 사용자입니다."));

        List<PostSummaryResponse> recentPosts = postRepository
                .findByUserId(user.getId(), PageRequest.of(0, 5, Sort.by("createdAt").descending()))
                .filter(p -> p.getStatus() == PostStatus.PUBLISHED)
                .map(PostSummaryResponse::from)
                .toList();

        return ResponseEntity.ok(ApiResponse.ok(PublicProfileResponse.of(user, recentPosts)));
    }
}
