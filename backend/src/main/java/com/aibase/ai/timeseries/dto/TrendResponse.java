package com.aibase.ai.timeseries.dto;

import java.time.LocalDate;
import java.util.List;

public record TrendResponse(
        List<VisitorStatDto> actual,
        List<PredictedPoint> predicted,
        double growthRate  // 최근 7일 대비 이전 7일 성장률 (%)
) {
    public record PredictedPoint(LocalDate date, int pageViews, int uniqueVisitors) {}
}
