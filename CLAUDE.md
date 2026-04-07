# AI Base — 루트 CLAUDE.md

## 프로젝트 개요
5개 실전 프로젝트의 AI 기술을 통합한 풀스택 포트폴리오 레퍼런스.
GitHub: https://github.com/Raconer/ai-base

## 디렉토리 구조
```
ai_base/
├── CLAUDE.md               ← 이 파일 (루트 전역 규칙)
├── harness.md              ← Claude Code 하네스 오케스트레이션 가이드
├── agents/                 ← 에이전트 역할 정의
│   ├── planner.md
│   ├── developer.md
│   ├── reviewer.md
│   └── qa.md
├── docs/
│   ├── PROJECT_PLAN.md     ← 전체 기획서
│   └── PROGRESS.md         ← 진행 현황 (세션 복구용)
├── backend/                ← Spring Boot (CLAUDE.md 별도)
├── frontend/               ← React (CLAUDE.md 별도)
├── database/               ← init.sql
└── docker/                 ← docker-compose.yml
```

## 브랜치 전략
- `main`: 골격 코드 (Phase 1)
- `feature/llm-api`: LLM API 통합
- `feature/vector-search`: pgvector 시맨틱 검색
- `feature/sentiment-analysis`: 감성 분석
- `feature/pdf-pipeline`: PDF 파이프라인
- `feature/ensemble-prediction`: 앙상블 예측
- `feature/adaptive-feedback`: 적응형 피드백
- `feature/multi-agent`: 멀티 에이전트
- `feature/timeseries`: 시계열 분석
- `feature/claude-md-hierarchy`: CLAUDE.md 계층 구조
- `feature/harness-orchestration`: 하네스 오케스트레이션
- `feature/token-optimization`: 토큰 최적화

## 세션 복구
세션 재시작 시 반드시 이 순서로 읽는다:
1. `docs/PROGRESS.md` — 현재 작업 위치 파악
2. `docs/PROJECT_PLAN.md` — 전체 설계 확인
3. 🔄 표시된 Phase의 ⬜ 항목부터 진행

## 전역 규칙
- 모든 API는 `ApiResponse<T>` 래핑
- 도메인별 CLAUDE.md 규칙 우선 (backend/, frontend/)
- feature 브랜치 각 폴더에 `README.md` 필수
- PROGRESS.md는 작업 완료 즉시 ✅ 업데이트
