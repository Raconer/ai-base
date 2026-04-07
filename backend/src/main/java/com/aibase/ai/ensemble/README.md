# Ensemble Prediction — AI Base

## 개요
인기도 기반 + 카테고리 기반 앙상블 투표로 콘텐츠를 추천한다.

**출처**: `lotto` 프로젝트 (Bayesian, Poisson, Markov Chain 앙상블)를 콘텐츠 추천에 이식.

---

## 앙상블 전략

```
① 인기도 점수 (viewCount 기반)   × 0.4
② 카테고리 점수 (같은 카테고리) × 0.6
──────────────────────────────
앙상블 최종 점수 (0.0~1.0)
```

**가중치 근거**: 사용자 관심사(카테고리)가 인기도보다 더 관련성 높다고 판단.

---

## API

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/ai/ensemble/recommend/post/{id}` | 게시글 기반 추천 |
| GET | `/api/ai/ensemble/recommend/popular` | 인기글 추천 |

---

## 확장 방법 (프로덕션)

```
현재: viewCount + category 앙상블
확장: 사용자 행동 데이터(조회 이력) 추가
    → Collaborative Filtering + 앙상블
    → 개인화 추천
```
