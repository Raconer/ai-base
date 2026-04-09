package com.aibase.ai.timeseries;

import com.aibase.ai.timeseries.dto.TrendResponse;
import com.aibase.ai.timeseries.dto.TrendResponse.PredictedPoint;
import com.aibase.ai.timeseries.dto.VisitorStatDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 시계열 분석 서비스.
 *
 * 출처: etf-platform의 시계열 트렌드 분석 + stock_traders TimescaleDB 패턴 이식.
 *
 * 기능:
 *   - 방문자 통계 조회 (최근 N일)
 *   - 선형 회귀 기반 트렌드 예측 (단순 이동 평균 + 추세선)
 *   - 성장률 계산 (최근 7일 vs 이전 7일)
 */
@Service
@Transactional(readOnly = true)
public class TimeSeriesService {

    private static final Logger log = LoggerFactory.getLogger(TimeSeriesService.class);

    private final VisitorStatsRepository repository;

    public TimeSeriesService(VisitorStatsRepository repository) {
        this.repository = repository;
    }

    public List<VisitorStatDto> getVisitors(int days) {
        LocalDate from = LocalDate.now().minusDays(days);
        List<VisitorStats> stats = repository.findFromDate(from);
        log.info("방문자 통계 조회: {}일치 {}건", days, stats.size());
        return stats.stream().map(this::toDto).toList();
    }

    public TrendResponse getTrend(int days) {
        LocalDate from = LocalDate.now().minusDays(days);
        List<VisitorStats> stats = repository.findFromDate(from);

        List<VisitorStatDto> actual = stats.stream().map(this::toDto).toList();
        List<PredictedPoint> predicted = predictNext7Days(stats);
        double growthRate = calculateGrowthRate(stats);

        log.info("트렌드 예측 완료: 성장률={}%", String.format("%.1f", growthRate));
        return new TrendResponse(actual, predicted, growthRate);
    }

    /**
     * 선형 회귀(최소제곱법)로 다음 7일 예측.
     * 데이터가 부족하면 최근값을 그대로 사용.
     */
    private List<PredictedPoint> predictNext7Days(List<VisitorStats> stats) {
        List<PredictedPoint> predictions = new ArrayList<>();
        if (stats.isEmpty()) return predictions;

        int n = stats.size();
        // x: 0, 1, 2, ... n-1
        double sumX = 0, sumY_pv = 0, sumY_uv = 0, sumXY_pv = 0, sumXY_uv = 0, sumX2 = 0;
        for (int i = 0; i < n; i++) {
            VisitorStats s = stats.get(i);
            sumX += i;
            sumY_pv += s.getPageViews();
            sumY_uv += s.getUniqueVisitors();
            sumXY_pv += (long) i * s.getPageViews();
            sumXY_uv += (long) i * s.getUniqueVisitors();
            sumX2 += (long) i * i;
        }

        double denom = n * sumX2 - sumX * sumX;
        double slope_pv = denom != 0 ? (n * sumXY_pv - sumX * sumY_pv) / denom : 0;
        double intercept_pv = (sumY_pv - slope_pv * sumX) / n;
        double slope_uv = denom != 0 ? (n * sumXY_uv - sumX * sumY_uv) / denom : 0;
        double intercept_uv = (sumY_uv - slope_uv * sumX) / n;

        LocalDate lastDate = stats.get(n - 1).getDate();
        for (int i = 1; i <= 7; i++) {
            int x = n - 1 + i;
            int pv = Math.max(0, (int) (slope_pv * x + intercept_pv));
            int uv = Math.max(0, (int) (slope_uv * x + intercept_uv));
            predictions.add(new PredictedPoint(lastDate.plusDays(i), pv, uv));
        }
        return predictions;
    }

    /**
     * 최근 7일 pageViews 합산 vs 이전 7일 비교해 성장률(%) 계산.
     */
    private double calculateGrowthRate(List<VisitorStats> stats) {
        if (stats.size() < 2) return 0.0;

        int size = stats.size();
        int recentStart = Math.max(0, size - 7);
        int prevStart = Math.max(0, size - 14);

        int recent = stats.subList(recentStart, size).stream().mapToInt(VisitorStats::getPageViews).sum();
        int prev = stats.subList(prevStart, recentStart).stream().mapToInt(VisitorStats::getPageViews).sum();

        if (prev == 0) return recent > 0 ? 100.0 : 0.0;
        return Math.round(((double) (recent - prev) / prev * 100) * 10.0) / 10.0;
    }

    private VisitorStatDto toDto(VisitorStats v) {
        return new VisitorStatDto(v.getDate(), v.getPageViews(), v.getUniqueVisitors(), v.getAvgDurationSec());
    }
}
