# Sentiment Analysis — AI Base

## 개요
Claude API를 활용한 텍스트 감성 분석. 블로그 글의 긍정/부정/중립 톤을 분석한다.

**출처 프로젝트**: `stock_traders` (Claude API 뉴스 감성분석, 주가 예측에 활용)

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 분석 엔진 | Claude Haiku (claude-haiku-4-5-20251001) |
| 출력 형식 | JSON (label + scores + summary) |
| 저장 | posts.sentiment_score (DOUBLE) |

---

## 파일 구조

```
ai/sentiment/
├── README.md
├── SentimentService.java    ← Claude API 호출 + JSON 파싱
├── SentimentController.java ← REST 엔드포인트
└── dto/
    ├── SentimentRequest.java
    └── SentimentResponse.java
```

---

## API

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/ai/sentiment/analyze` | 텍스트 감성 분석 |
| POST | `/api/ai/sentiment/post/{id}` | 게시글 감성 분석 |

---

## 응답 예시

```json
{
  "label": "POSITIVE",
  "score": 0.82,
  "positive": 0.82,
  "negative": 0.05,
  "neutral": 0.13,
  "summary": "열정적이고 긍정적인 내용"
}
```

---

## 아키텍처

```
텍스트 입력
    │
    ▼
SentimentService.analyze()
    │ 프롬프트 생성
    ▼
Claude Haiku API
    │ JSON 응답
    ▼
ObjectMapper 파싱
    │
    ▼
SentimentResponse (label, scores, summary)
    │
    ▼ (옵션)
posts.sentiment_score 저장
```

---

## 활용 방법

글 작성 후 자동 감성 분석:
1. POST `/api/ai/sentiment/post/{postId}` 호출
2. `sentiment_score` DB 저장
3. 프론트엔드 `SentimentBadge` 컴포넌트로 시각화

**다음 단계**: `feature/adaptive-feedback` — 감성 분석을 피드백 루프에 통합
