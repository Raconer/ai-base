package com.aibase.ai.timeseries;

import com.aibase.ai.timeseries.dto.TrendResponse;
import com.aibase.ai.timeseries.dto.VisitorStatDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class TimeSeriesServiceTest {

    @Mock
    private VisitorStatsRepository repository;

    private TimeSeriesService service;

    @BeforeEach
    void setUp() {
        service = new TimeSeriesService(repository);
    }

    @Test
    @DisplayName("getVisitors — 조회 결과를 DTO로 변환해 반환한다")
    void getVisitors_returnsDtoList() {
        // given
        List<VisitorStats> stats = List.of(
                new VisitorStats(LocalDate.of(2026, 4, 1), 100, 70, 120),
                new VisitorStats(LocalDate.of(2026, 4, 2), 120, 80, 130)
        );
        given(repository.findFromDate(any())).willReturn(stats);

        // when
        List<VisitorStatDto> result = service.getVisitors(30);

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).pageViews()).isEqualTo(100);
        assertThat(result.get(1).uniqueVisitors()).isEqualTo(80);
    }

    @Test
    @DisplayName("getTrend — 실제 데이터 + 7일 예측 + 성장률을 반환한다")
    void getTrend_returnsActualAndPredicted() {
        // given — 14일치 데이터 (성장률 계산 가능)
        List<VisitorStats> stats = buildStats(14);
        given(repository.findFromDate(any())).willReturn(stats);

        // when
        TrendResponse result = service.getTrend(30);

        // then
        assertThat(result.actual()).hasSize(14);
        assertThat(result.predicted()).hasSize(7);
        assertThat(result.predicted()).allMatch(p -> p.pageViews() >= 0);
    }

    @Test
    @DisplayName("getTrend — 데이터가 없으면 빈 결과와 성장률 0을 반환한다")
    void getTrend_returnsEmpty_whenNoData() {
        // given
        given(repository.findFromDate(any())).willReturn(List.of());

        // when
        TrendResponse result = service.getTrend(30);

        // then
        assertThat(result.actual()).isEmpty();
        assertThat(result.predicted()).isEmpty();
        assertThat(result.growthRate()).isEqualTo(0.0);
    }

    @Test
    @DisplayName("getTrend — 이전 7일 pageViews가 0이면 성장률 100% 반환")
    void getTrend_growthRate100_whenPrevIsZero() {
        // given — 최근 7일만 존재 (이전 7일 데이터 없음)
        List<VisitorStats> stats = buildStats(7);
        given(repository.findFromDate(any())).willReturn(stats);

        // when
        TrendResponse result = service.getTrend(30);

        // then
        assertThat(result.growthRate()).isEqualTo(100.0);
    }

    private List<VisitorStats> buildStats(int days) {
        LocalDate base = LocalDate.of(2026, 3, 26);
        return java.util.stream.IntStream.range(0, days)
                .mapToObj(i -> new VisitorStats(base.plusDays(i), 100 + i * 5, 70 + i * 3, 120))
                .toList();
    }
}
