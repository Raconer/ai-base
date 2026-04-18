# AI Base — 에이전트 가이드

> Claude Code 멀티 에이전트 개발 방법론.
> 각 에이전트는 역할이 분리되어 있으며 파일 기반으로 통신한다.

---

## 에이전트 구성

| 에이전트 | 파일 | 역할 |
|---------|------|------|
| Planner | `planner.md` | 요구사항 분석 + 스펙 문서 작성 |
| Developer | `developer.md` | 스펙 기반 코드 구현 |
| Reviewer | `reviewer.md` | 코드 리뷰 + 컨벤션 검증 |
| QA | `qa.md` | 테스트 시나리오 작성 + 검증 |

---

## 표준 파이프라인

```
① Planner  →  spec.md 작성
② Developer →  코드 구현 + PROGRESS.md 업데이트
③ Reviewer  →  코드 리뷰 (review.md 출력)
④ QA        →  테스트 시나리오 작성 및 검증
⑤ Git       →  커밋 + 브랜치 머지
```

---

## 에이전트 간 통신 (파일 기반)

```
spec.md          ← Planner 작성, Developer 읽기
review.md        ← Reviewer 작성
test-report.md   ← QA 작성
```

에이전트 간 전체 대화 컨텍스트를 공유하지 않고
**파일만 전달**하여 토큰 소비를 최소화한다.

---

## 사용법

```bash
# 1. Planner에게 스펙 작성 요청
claude --agent agents/planner.md "feature/llm-api 스펙 작성해줘"

# 2. Developer에게 구현 요청 (spec.md만 참조)
claude --agent agents/developer.md "spec.md 읽고 구현해줘"

# 3. Reviewer에게 리뷰 요청
claude --agent agents/reviewer.md "구현된 코드 리뷰해줘"

# 4. QA에게 테스트 요청
claude --agent agents/qa.md "테스트 시나리오 작성해줘"
```

---

## Spec-as-Contract 원칙

- Planner가 `spec.md`를 작성하면 이것이 **계약서**가 된다.
- Developer는 `spec.md`만 읽고 구현한다 (전체 대화 불필요).
- Reviewer는 `spec.md` + 구현 코드만 읽고 리뷰한다.
- 스펙 변경 시 반드시 `spec.md`를 먼저 업데이트한다.
