package com.aibase.ai.ensemble;

import com.aibase.ai.ensemble.dto.RecommendationResponse;
import com.aibase.ai.ensemble.dto.RecommendationResponse.PostRecommendation;
import com.aibase.domain.post.entity.Post;
import com.aibase.domain.post.entity.PostStatus;
import com.aibase.domain.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 앙상블 콘텐츠 추천 서비스.
 *
 * 출처: lotto 프로젝트 (Bayesian, Poisson, Markov Chain 앙상블 투표)를
 * 콘텐츠 추천에 맞게 이식.
 *
 * 전략:
 * ① 인기도 기반 (view_count, 최근성)
 * ② 카테고리 기반 (같은 카테고리 글)
 * ③ 앙상블 = ①×0.4 + ②×0.6 가중 평균
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EnsemblePredictionService {

    private final PostRepository postRepository;

    private static final double POPULARITY_WEIGHT = 0.4;
    private static final double CATEGORY_WEIGHT = 0.6;

    /**
     * 게시글 기반 추천 (앙상블)
     */
    public RecommendationResponse recommend(Long postId, int topK) {
        Post target = postRepository.findById(postId).orElse(null);
        if (target == null) {
            return popularRecommend(topK);
        }

        // ① 인기도 기반 후보
        List<Post> popularCandidates = postRepository
                .findByStatus(PostStatus.PUBLISHED, PageRequest.of(0, 20, Sort.by("viewCount").descending()))
                .getContent();

        // ② 카테고리 기반 후보
        List<Post> categoryCandidates = target.getCategory() != null
                ? postRepository.findByCategoryAndStatus(
                        target.getCategory(), PostStatus.PUBLISHED,
                        PageRequest.of(0, 20, Sort.by("createdAt").descending()))
                  .getContent()
                : Collections.emptyList();

        // 앙상블 점수 계산
        Map<Long, double[]> scores = new LinkedHashMap<>();

        double maxViews = popularCandidates.stream().mapToInt(Post::getViewCount).max().orElse(1);

        for (Post p : popularCandidates) {
            if (p.getId().equals(postId)) continue;
            double popularityScore = p.getViewCount() / maxViews;
            scores.computeIfAbsent(p.getId(), k -> new double[]{0, 0, 0})[0] = popularityScore;
            scores.get(p.getId())[2] = p.getTitle().length(); // title 임시 저장 (ID로 조회용)
        }

        for (Post p : categoryCandidates) {
            if (p.getId().equals(postId)) continue;
            scores.computeIfAbsent(p.getId(), k -> new double[]{0, 0, 0})[1] = 0.8;
        }

        // 가중 평균 계산 및 정렬
        List<Post> allPosts = new ArrayList<>(popularCandidates);
        categoryCandidates.forEach(p -> { if (!allPosts.contains(p)) allPosts.add(p); });

        Map<Long, Post> postMap = new HashMap<>();
        allPosts.forEach(p -> postMap.put(p.getId(), p));

        List<PostRecommendation> recommendations = scores.entrySet().stream()
                .filter(e -> !e.getKey().equals(postId))
                .map(e -> {
                    double[] s = e.getValue();
                    double ensemble = s[0] * POPULARITY_WEIGHT + s[1] * CATEGORY_WEIGHT;
                    Post p = postMap.get(e.getKey());
                    String reason = s[1] > 0 ? "같은 카테고리의 인기 글" : "조회수 높은 글";
                    return new PostRecommendation(p.getId(), p.getTitle(), p.getCategory(), ensemble, reason);
                })
                .sorted(Comparator.comparingDouble(PostRecommendation::score).reversed())
                .limit(topK)
                .toList();

        log.info("앙상블 추천 완료 — postId: {}, 결과: {}개", postId, recommendations.size());
        return new RecommendationResponse(recommendations, "ensemble");
    }

    /**
     * 인기글 기반 추천 (기본)
     */
    public RecommendationResponse popularRecommend(int topK) {
        List<Post> posts = postRepository
                .findByStatus(PostStatus.PUBLISHED, PageRequest.of(0, topK, Sort.by("viewCount").descending()))
                .getContent();

        int maxViews = posts.stream().mapToInt(Post::getViewCount).max().orElse(1);

        List<PostRecommendation> recommendations = posts.stream()
                .map(p -> new PostRecommendation(
                        p.getId(), p.getTitle(), p.getCategory(),
                        (double) p.getViewCount() / maxViews,
                        "인기 게시글"))
                .toList();

        return new RecommendationResponse(recommendations, "popular");
    }
}
