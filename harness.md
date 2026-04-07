# AI Base — Claude Code 하네스 가이드

## 개요
Claude Code를 활용한 효율적인 개발 방법론.
AI 기술 feature 브랜치 개발 시 이 가이드를 따른다.

---

## 표준 개발 파이프라인

```
① Planner  →  spec.md 작성
② Developer →  코드 구현 + PROGRESS.md 업데이트
③ Reviewer  →  코드 리뷰
④ QA        →  테스트 시나리오 작성 및 검증
⑤ Git       →  커밋 + 브랜치 푸시 + PR
```

---

## 세션 시작 루틴

새 세션 시작 시 Claude에게 전달할 프롬프트:
```
docs/PROGRESS.md와 docs/PROJECT_PLAN.md를 읽고
현재 🔄 Phase의 ⬜ 항목부터 이어서 진행해줘.
작업 완료 시 PROGRESS.md를 ✅로 업데이트해줘.
```

---

## 토큰 절약 전략

### 모델 티어링
| 작업 | 모델 |
|------|------|
| 간단한 CRUD 구현 | claude-haiku-4-5 |
| 복잡한 AI 로직 구현 | claude-sonnet-4-6 |
| 아키텍처 설계, 리뷰 | claude-opus-4-6 |

### 파일 기반 통신
- 에이전트 간 결과물은 파일로 전달 (`spec.md`, `review.md`)
- 대형 결과물은 파일에 저장 후 경로만 참조

### Spec-as-Contract
- planner가 `spec.md` 작성
- developer는 spec만 읽고 구현 (전체 대화 컨텍스트 불필요)
- reviewer는 spec + 코드만 읽고 리뷰

### max-turns 제한
- 반복적인 수정 루프 방지
- 명확한 스펙으로 1회 구현 완성 목표

---

## feature 브랜치 개발 순서

```bash
# 브랜치 생성
git checkout -b feature/llm-api

# 개발 (planner → developer → reviewer → qa)

# AI 폴더 README.md 작성 (필수)
# backend/src/main/java/com/aibase/ai/llm/README.md

# 커밋
git add .
git commit -m "feat: LLM API 연동 구현"

# PR 생성
git push origin feature/llm-api
gh pr create --title "feat: LLM API 통합" --body "..."
```

---

## CLAUDE.md 계층 구조

```
루트 CLAUDE.md          ← 전역 규칙, 브랜치 전략, 세션 복구
└── backend/CLAUDE.md   ← BE 컨벤션, 패키지 구조, 코드 패턴
└── frontend/CLAUDE.md  ← FE 컨벤션, 상태 관리, API 호출 패턴
    └── ai/*/README.md  ← AI 기술별 설명 (각 feature 브랜치)
```

Claude Code는 현재 디렉토리부터 상위로 CLAUDE.md를 자동 로드.
모듈별 CLAUDE.md가 가장 높은 우선순위를 가짐.

---

## Pre-Write 훅 (권고)

새 파일 작성 전 체크리스트:
1. 기존 유사 파일이 있는지 확인
2. 관련 CLAUDE.md 컨벤션 확인
3. 필요한 import/dependency 확인
4. PROGRESS.md 해당 항목 확인
