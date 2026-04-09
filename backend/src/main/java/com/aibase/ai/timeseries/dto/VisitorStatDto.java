package com.aibase.ai.timeseries.dto;

import java.time.LocalDate;

public record VisitorStatDto(
        LocalDate date,
        int pageViews,
        int uniqueVisitors,
        int avgDurationSec
) {}
