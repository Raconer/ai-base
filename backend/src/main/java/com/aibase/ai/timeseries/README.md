# TimeSeries Analysis — AI Base

## 개요
방문자 통계 조회 + 선형 회귀 기반 트렌드 예측.
실제 데이터(visitor_stats)에서 성장률 계산 및 향후 7일 예측값 제공.

**출처**: `etf-platform` 시계열 트렌드 + `stock_traders` TimescaleDB 패턴 이식.

---

## 알고리즘

### 선형 회귀 (최소제곱법)
```
y = slope * x + intercept
slope = (n*ΣXY - ΣX*ΣY) / (n*ΣX² - (ΣX)²)
```
- x: 날짜 인덱스 (0, 1, 2, ...)
- y: pageViews 또는 uniqueVisitors
- 다음 7일의 x값을 대입해 예측

### 성장률 계산
```
growthRate = (최근7일 합산 - 이전7일 합산) / 이전7일 합산 * 100
```

---

## API

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/stats/visitors?days=30` | 방문자 통계 조회 |
| GET | `/api/stats/trend?days=30` | 트렌드 예측 |

**visitors 응답**
```json
[
  { "date": "2026-04-01", "pageViews": 120, "uniqueVisitors": 80, "avgDurationSec": 145 }
]
```

**trend 응답**
```json
{
  "actual": [...],
  "predicted": [
    { "date": "2026-04-10", "pageViews": 135, "uniqueVisitors": 90 }
  ],
  "growthRate": 12.5
}
```

---

## 프론트엔드

`VisitorChart.tsx` — Recharts ComposedChart (실제 Bar + 예측 Line)
