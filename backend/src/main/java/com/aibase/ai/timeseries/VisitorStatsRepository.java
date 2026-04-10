package com.aibase.ai.timeseries;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VisitorStatsRepository extends JpaRepository<VisitorStats, Long> {

    @Query("SELECT v FROM VisitorStats v WHERE v.date >= :from ORDER BY v.date ASC")
    List<VisitorStats> findFromDate(@Param("from") LocalDate from);

    @Query("SELECT v FROM VisitorStats v ORDER BY v.date DESC LIMIT :limit")
    List<VisitorStats> findLatest(@Param("limit") int limit);
}
