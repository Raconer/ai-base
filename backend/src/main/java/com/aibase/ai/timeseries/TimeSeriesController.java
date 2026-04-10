package com.aibase.ai.timeseries;

import com.aibase.ai.timeseries.dto.TrendResponse;
import com.aibase.ai.timeseries.dto.VisitorStatDto;
import com.aibase.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@Tag(name = "Stats - TimeSeries", description = "방문자 통계 + 시계열 트렌드 예측")
public class TimeSeriesController {

    private final TimeSeriesService timeSeriesService;

    public TimeSeriesController(TimeSeriesService timeSeriesService) {
        this.timeSeriesService = timeSeriesService;
    }

    @GetMapping("/visitors")
    @Operation(summary = "방문자 통계 조회", description = "최근 N일 방문자 통계 (기본 30일)")
    public ResponseEntity<ApiResponse<List<VisitorStatDto>>> getVisitors(
            @RequestParam(defaultValue = "30") int days) {

        List<VisitorStatDto> stats = timeSeriesService.getVisitors(days);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/trend")
    @Operation(summary = "트렌드 예측", description = "실제 통계 + 향후 7일 선형 회귀 예측 + 성장률")
    public ResponseEntity<ApiResponse<TrendResponse>> getTrend(
            @RequestParam(defaultValue = "30") int days) {

        TrendResponse trend = timeSeriesService.getTrend(days);
        return ResponseEntity.ok(ApiResponse.ok(trend));
    }
}
