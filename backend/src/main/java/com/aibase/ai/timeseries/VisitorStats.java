package com.aibase.ai.timeseries;

import com.aibase.common.entity.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "visitor_stats")
public class VisitorStats extends BaseEntity {

    @Column(nullable = false, unique = true)
    private LocalDate date;

    @Column(nullable = false)
    private int pageViews;

    @Column(nullable = false)
    private int uniqueVisitors;

    @Column(nullable = false)
    private int avgDurationSec;

    protected VisitorStats() {}

    public VisitorStats(LocalDate date, int pageViews, int uniqueVisitors, int avgDurationSec) {
        this.date = date;
        this.pageViews = pageViews;
        this.uniqueVisitors = uniqueVisitors;
        this.avgDurationSec = avgDurationSec;
    }

    public LocalDate getDate() { return date; }
    public int getPageViews() { return pageViews; }
    public int getUniqueVisitors() { return uniqueVisitors; }
    public int getAvgDurationSec() { return avgDurationSec; }
}
