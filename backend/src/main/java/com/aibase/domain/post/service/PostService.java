package com.aibase.domain.post.service;

import com.aibase.common.dto.PageResponse;
import com.aibase.common.exception.BusinessException;
import com.aibase.domain.post.dto.PostRequest;
import com.aibase.domain.post.dto.PostResponse;
import com.aibase.domain.post.dto.PostSummaryResponse;
import com.aibase.domain.post.entity.Post;
import com.aibase.domain.post.entity.PostStatus;
import com.aibase.domain.post.entity.PostTag;
import com.aibase.domain.post.entity.Tag;
import com.aibase.domain.post.repository.PostRepository;
import com.aibase.domain.post.repository.TagRepository;
import com.aibase.domain.user.entity.User;
import com.aibase.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    public PageResponse<PostSummaryResponse> getPosts(String category, Pageable pageable) {
        Page<Post> page = (category != null && !category.isBlank())
                ? postRepository.findByCategoryAndStatus(category, PostStatus.PUBLISHED, pageable)
                : postRepository.findByStatus(PostStatus.PUBLISHED, pageable);

        return PageResponse.from(page.map(PostSummaryResponse::from));
    }

    public PageResponse<PostSummaryResponse> searchPosts(String keyword, Pageable pageable) {
        Page<Post> page = postRepository.searchByKeyword(keyword, PostStatus.PUBLISHED, pageable);
        return PageResponse.from(page.map(PostSummaryResponse::from));
    }

    @Transactional
    public PostResponse getPost(Long id) {
        Post post = findPostById(id);
        post.incrementViewCount();
        return PostResponse.from(post);
    }

    @Transactional
    public PostResponse create(Long userId, PostRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("사용자를 찾을 수 없습니다", HttpStatus.NOT_FOUND));

        PostStatus status = parseStatus(request.status());

        Post post = Post.builder()
                .title(request.title())
                .content(request.content())
                .category(request.category())
                .status(status)
                .user(user)
                .build();

        attachTags(post, request.tags());
        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public PostResponse update(Long userId, Long postId, PostRequest request) {
        Post post = findPostById(postId);
        validateOwner(post, userId);

        post.update(request.title(), request.content(), request.category(), parseStatus(request.status()));
        post.clearTags();
        attachTags(post, request.tags());

        return PostResponse.from(post);
    }

    @Transactional
    public void delete(Long userId, Long postId) {
        Post post = findPostById(postId);
        validateOwner(post, userId);
        postRepository.delete(post);
    }

    public PageResponse<PostSummaryResponse> getMyPosts(Long userId, Pageable pageable) {
        Page<Post> page = postRepository.findByUserId(userId, pageable);
        return PageResponse.of(page.map(PostSummaryResponse::from));
    }

    private Post findPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new BusinessException("게시글을 찾을 수 없습니다", HttpStatus.NOT_FOUND));
    }

    private void validateOwner(Post post, Long userId) {
        if (!post.getUser().getId().equals(userId)) {
            throw new BusinessException("권한이 없습니다", HttpStatus.FORBIDDEN);
        }
    }

    private PostStatus parseStatus(String status) {
        if (status == null) return PostStatus.DRAFT;
        try {
            return PostStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return PostStatus.DRAFT;
        }
    }

    private void attachTags(Post post, List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) return;

        for (String name : tagNames) {
            Tag tag = tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));

            PostTag postTag = PostTag.builder()
                    .post(post)
                    .tag(tag)
                    .build();
            post.addPostTag(postTag);
        }
    }
}
