# AI 컴포넌트 — Frontend

## 개요
각 feature 브랜치에서 추가되는 AI 기능의 프론트엔드 컴포넌트 모음.

## 컴포넌트 목록

| 컴포넌트 | 브랜치 | 기능 |
|----------|--------|------|
| `AiWriter.tsx` | feature/llm-api | 글 AI 교정 모달 UI |
| `SentimentBadge.tsx` | feature/sentiment-analysis | 감성 스코어 뱃지 |
| `SemanticSearch.tsx` | feature/vector-search | 벡터 기반 시맨틱 검색 UI |
| `FeedbackPanel.tsx` | feature/adaptive-feedback | 글 품질 피드백 패널 |

## AiWriter 사용법

```tsx
import AiWriter from '../components/ai/AiWriter'

// PostEditor에서 사용
<AiWriter
  text={content}           // 교정할 텍스트
  onApply={(corrected) => setContent(corrected)}  // 결과 적용 콜백
/>
```

## 추가 방법 (feature 브랜치)
1. `src/components/ai/` 아래에 컴포넌트 파일 생성
2. 이 README.md에 컴포넌트 목록 업데이트
3. 해당 페이지에 import 및 통합
