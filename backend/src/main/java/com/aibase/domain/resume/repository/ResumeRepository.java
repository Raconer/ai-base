package com.aibase.domain.resume.repository;

import com.aibase.domain.resume.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUserId(Long userId);

    Optional<Resume> findByUserIdAndIsPrimaryTrue(Long userId);

    List<Resume> findByUserIdAndIsPrimaryTrue(Long userId, org.springframework.data.domain.Pageable pageable);
}
