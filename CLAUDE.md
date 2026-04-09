# AI Base — 루트 CLAUDE.md

## 하네스 자동 관리 원칙
같은 실수가 2번 이상 반복되면 harness-builder 에이전트를 호출해서
`.claude/settings.json`에 Hook을 자동으로 추가해라.

## 프로젝트 개요
5개 실전 프로젝트의 AI 기술을 통합한 풀스택 포트폴리오 레퍼런스.
GitHub: https://github.com/Raconer/ai-base

## 디렉토리 구조
```
ai_base/
├── CLAUDE.md               ← 이 파일 (전역 최소 규칙)
├── backend/CLAUDE.md       ← Spring Boot 상세 규칙
├── frontend/CLAUDE.md      ← React 상세 규칙
├── docs/PROGRESS.md        ← 세션 복구 + 진행 현황
└── .claude/settings.json   ← Hook 정의
```

## 전역 규칙
- 모든 API는 `ApiResponse<T>` 래핑
- 도메인별 CLAUDE.md 규칙 우선 (backend/, frontend/)
- feature 브랜치 각 폴더에 `README.md` 필수
- PROGRESS.md는 작업 완료 즉시 ✅ 업데이트

## 세션 복구
재시작 시: `docs/PROGRESS.md` → `docs/PROJECT_PLAN.md` 순서로 읽고 🔄 항목부터 진행.

## 브랜치 전략
`main`(골격) → feature/* 에서 개발 → main 머지.
브랜치 목록은 `docs/PROGRESS.md` 참고.

## Hook exit 코드
| exit 코드 | 의미 |
|-----------|------|
| `0` | 통과 |
| `1` | 에러 — Claude 재수정 |
| `2` | 차단 — 실행 불가 |
