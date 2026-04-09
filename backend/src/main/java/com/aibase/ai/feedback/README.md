# Adaptive Feedback Loop — AI Base

## 개요
작성 → AI 평가 → 수정 제안 → 재평가 → 수렴의 적응형 피드백 루프.
80점 이상이면 수렴(조기 종료), 아니면 maxIterations까지 반복.

**출처**: `novel_studio` 12단계 생성 파이프라인의 피드백 루프 이식.

---

## 루프 흐름

```
입력 텍스트
    │
    ▼ ① 평가
  score < 80?
    │ YES        NO → 수렴 종료
    ▼
  제안 사항 추출
    │
    ▼ ② 개선
  개선된 텍스트
    │
    └──→ ① 재평가 (maxIterations까지)
```

---

## API

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/ai/feedback/run` | 피드백 루프 실행 |

**요청**
```json
{ "text": "글 내용...", "maxIterations": 3 }
```

**응답**
```json
{
  "originalText": "원문",
  "improvedText": "최종 개선본",
  "iterations": [
    { "iteration": 1, "score": 62, "suggestions": [...], "improvedText": "..." },
    { "iteration": 2, "score": 81, "suggestions": [...], "improvedText": "..." }
  ],
  "finalScore": 81,
  "converged": true
}
```

---

## 프론트엔드

`FeedbackPanel.tsx` — 각 회차별 점수 변화 시각화 (예정)
