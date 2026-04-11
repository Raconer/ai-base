package com.aibase.domain.post.repository;

import com.aibase.domain.post.entity.Post;
import com.aibase.domain.post.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByStatus(PostStatus status, Pageable pageable);

    Page<Post> findByCategoryAndStatus(String category, PostStatus status, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Post> searchByKeyword(@Param("keyword") String keyword,
                               @Param("status") PostStatus status,
                               Pageable pageable);

    Page<Post> findByUserId(Long userId, Pageable pageable);

    Page<Post> findByUserUsernameAndStatus(String username, PostStatus status, Pageable pageable);
}
