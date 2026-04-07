# LLM API 통합 — AI Base

## 개요
Anthropic Claude API를 활용한 텍스트 처리 기능.
글 AI 교정, 이력서 요약, 글 품질 평가를 제공한다.

**출처 프로젝트**: `novel_studio` (Gemini LLM 12단계 파이프라인)에서 Claude API로 이식

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| SDK | Anthropic Java SDK 0.8.0 |
| 기본 모델 | claude-haiku-4-5-20251001 (빠름, 저비용) |
| 고품질 작업 | claude-sonnet-4-6 (복잡한 교정) |

---

## 파일 구조

```
ai/llm/
├── README.md              ← 이 파일
├── LlmConfig.java         ← AnthropicClient Bean 설정
├── LlmService.java        ← 핵심 LLM 로직
├── LlmController.java     ← REST 엔드포인트
└── dto/
    ├── LlmCorrectRequest.java
    ├── LlmSummarizeRequest.java
    └── LlmResponse.java
```

---

## API 엔드포인트

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/ai/llm/correct` | 글 AI 교정 | ✅ |
| POST | `/api/ai/llm/summarize` | 이력서 요약 | ✅ |
| POST | `/api/ai/llm/evaluate` | 글 품질 평가 | ✅ |

---

## 사용 예시

### 글 교정
```json
POST /api/ai/llm/correct
{
  "text": "안녕하세용. 오늘 스프링 부트를 공부했어용.",
  "tone": "formal"
}
```

**응답**
```json
{
  "success": true,
  "data": {
    "result": "안녕하세요. 오늘 Spring Boot를 공부했습니다.",
    "model": "claude-haiku-4-5-20251001",
    "inputTokens": 85,
    "outputTokens": 30
  }
}
```

### 이력서 요약
```json
POST /api/ai/llm/summarize
{
  "text": "5년 경력 백엔드 개발자...",
  "maxLength": 150
}
```

---

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `ANTHROPIC_API_KEY` | Anthropic API 키 | (필수) |
| `anthropic.model` | 사용 모델 | claude-haiku-4-5-20251001 |
| `anthropic.max-tokens` | 최대 출력 토큰 | 2048 |

---

## 아키텍처

```
클라이언트 요청
    │
    ▼
LlmController (REST)
    │
    ▼
LlmService
    ├── correctPost()     → 프롬프트 생성 → callClaude()
    ├── summarizeResume() → 프롬프트 생성 → callClaude()
    └── evaluatePost()    → 프롬프트 생성 → callClaude()
            │
            ▼
    AnthropicClient (SDK)
            │
            ▼
    Claude API (Haiku/Sonnet)
            │
            ▼
    LlmResponse (result, model, tokens)
```

---

## 토큰 비용 최적화

- **기본 모델**: `claude-haiku-4-5` — 비용 대비 성능 최적
- **고품질 작업**: `claude-sonnet-4-6` — 복잡한 교정/평가 시 선택적 사용
- **max-tokens**: 작업별 적절히 제한 (교정: 2048, 요약: 512)
- **프롬프트**: 간결하게 유지 — 불필요한 설명 제거

---

## 확장 방법

1. `LlmService`에 새 메서드 추가
2. `LlmController`에 엔드포인트 추가
3. 이 README.md에 예시 업데이트

**다음 단계**: `feature/adaptive-feedback` 브랜치에서 적응형 피드백 루프 구현
(작성 → AI 평가 → 수정 제안 → 재평가 수렴)
