# Multi-Agent Pipeline — AI Base

## 개요
분류 → 태그 → 요약의 3단계 에이전트 파이프라인.
각 에이전트가 독립적으로 역할을 수행하며, 오케스트레이터가 순서를 조율한다.

**출처**: `stock_traders` Claude API 파이프라인 + `novel_studio` 다단계 생성 이식.

---

## 에이전트 파이프라인

```
입력 텍스트
    │
    ▼ ① 분류 에이전트
  category (tech/life/career/review/tutorial/other)
    │
    ▼ ② 태그 에이전트
  tags: ["tag1", ..., "tag5"]
    │
    ▼ ③ 요약 에이전트
  summary: "2~3문장 요약"
    │
    ▼ AgentResponse
  {category, tags, summary, steps[]}
```

---

## API

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/ai/agent/classify` | 자동 분류 + 태그 + 요약 |

**요청**
```json
{ "text": "글 내용...", "postId": 1 }
```

**응답**
```json
{
  "category": "tech",
  "tags": ["spring-boot", "java", "rest-api", "backend", "jwt"],
  "summary": "Spring Boot 기반 REST API 서버 구현 방법을 다룹니다.",
  "steps": [
    { "agentName": "분류 에이전트", "input": "...", "output": "tech", "durationMs": 320 },
    { "agentName": "태그 에이전트", "input": "tech", "output": "spring-boot, ...", "durationMs": 280 },
    { "agentName": "요약 에이전트", "input": "...", "output": "...", "durationMs": 410 }
  ]
}
```

---

## 프론트엔드

`AgentPanel.tsx` — 에이전트 단계별 진행 시각화 + 태그/카테고리 적용 UI
