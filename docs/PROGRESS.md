# AI Base - 진행 현황

> 마지막 업데이트: 2026-04-07 (Phase 1 완료)
> 세션이 끊겼을 경우 이 문서를 읽고 이어서 작업하세요.

---

## 현재 상태

- **현재 Phase**: Phase 2 (AI 기술 적용) 진행중
- **현재 작업**: feature/ensemble-prediction 완료 → feature/adaptive-feedback 시작 전
- **GitHub**: https://github.com/Raconer/ai-base (public)
- **브랜치**: main

---

## Phase 0: 프로젝트 초기화 ✅ 완료

| 작업 | 상태 | 파일 |
|------|------|------|
| 기획서 작성 | ✅ | docs/PROJECT_PLAN.md |
| README.md 작성 | ✅ | README.md |
| .gitignore 작성 | ✅ | .gitignore |
| Git 초기화 | ✅ | - |
| GitHub public 레포 생성 | ✅ | Raconer/ai-base |
| Initial commit + push | ✅ | commit: 54ca5f9 |

---

## Phase 1: main 브랜치 — 프로젝트 골격 ✅ 완료

### 1.1 Backend (Spring Boot 3.4 + Java 21)

| 작업 | 상태 | 파일/폴더 |
|------|------|----------|
| build.gradle.kts (JPA, QueryDSL, Security, pgvector) | ✅ | backend/build.gradle.kts |
| settings.gradle.kts | ✅ | backend/settings.gradle.kts |
| application.yml | ✅ | backend/src/main/resources/application.yml |
| AiBaseApplication.java (메인) | ✅ | backend/src/main/java/com/aibase/ |
| SecurityConfig + JwtTokenProvider | ✅ | config/, common/security/ |
| JpaConfig + QueryDslConfig | ✅ | config/ |
| CorsConfig + SwaggerConfig | ✅ | config/ |
| BaseEntity (공통) | ✅ | common/entity/ |
| ApiResponse (공통 응답) | ✅ | common/dto/ |
| GlobalExceptionHandler | ✅ | common/exception/ |
| User 도메인 (Entity, Repo, Service, Controller, DTO) | ✅ | domain/user/ |
| Post 도메인 (Entity, Repo, Service, Controller, DTO) | ✅ | domain/post/ |
| Tag + PostTag 도메인 | ✅ | domain/post/ |
| Resume 도메인 (Entity, Repo, Service, Controller, DTO) | ✅ | domain/resume/ |
| Pdf 도메인 (Entity, Repo, Service, Controller, DTO) | ✅ | domain/pdf/ |
| Dockerfile | ✅ | backend/Dockerfile |
| CLAUDE.md (BE 컨벤션) | ✅ | backend/CLAUDE.md |

### 1.2 Frontend (React 19 + Vite + TypeScript)

| 작업 | 상태 | 파일/폴더 |
|------|------|----------|
| Vite + React + TS 프로젝트 초기화 | ✅ | frontend/ |
| TailwindCSS 설정 | ✅ | frontend/vite.config.ts (@tailwindcss/vite) |
| React Router 설정 | ✅ | frontend/src/App.tsx |
| API 클라이언트 (Axios) | ✅ | frontend/src/lib/api.ts |
| Zustand 스토어 (auth, theme) | ✅ | frontend/src/stores/ |
| Layout 컴포넌트 (Header, Footer, Layout) | ✅ | frontend/src/components/layout/ |
| 공통 UI 컴포넌트 (Button, Input, Card, Modal) | ✅ | frontend/src/components/ui/ |
| Home 페이지 | ✅ | frontend/src/pages/Home.tsx |
| Blog 페이지 (목록) | ✅ | frontend/src/pages/Blog.tsx |
| PostDetail 페이지 | ✅ | frontend/src/pages/PostDetail.tsx |
| PostEditor 페이지 | ✅ | frontend/src/pages/PostEditor.tsx |
| Resume 페이지 | ✅ | frontend/src/pages/Resume.tsx |
| Search 페이지 | ✅ | frontend/src/pages/Search.tsx |
| About 페이지 | ✅ | frontend/src/pages/About.tsx |
| Login 페이지 | ✅ | frontend/src/pages/Login.tsx |
| Dashboard 페이지 | ✅ | frontend/src/pages/Dashboard.tsx |
| 테마 (dark/light) | ✅ | frontend/src/stores/themeStore.ts |
| Dockerfile | ✅ | frontend/Dockerfile |
| CLAUDE.md (FE 컨벤션) | ✅ | frontend/CLAUDE.md |

### 1.3 Database + Docker

| 작업 | 상태 | 파일/폴더 |
|------|------|----------|
| init.sql (스키마 + pgvector) | ✅ | database/init.sql |
| docker-compose.yml (PG + Redis + BE + FE) | ✅ | docker/docker-compose.yml |

### 1.4 Claude Code 방법론

| 작업 | 상태 | 파일/폴더 |
|------|------|----------|
| 루트 CLAUDE.md | ✅ | CLAUDE.md |
| agents/ (planner, developer, reviewer, qa) | ✅ | agents/*.md |
| harness.md | ✅ | harness.md |

### 1.5 커밋 + 푸시

| 작업 | 상태 |
|------|------|
| Phase 1 전체 커밋 | ✅ |
| main 브랜치 push | ✅ |

---

## Phase 2: Feature 브랜치 — AI 기술 적용 🔄 진행중

| 순서 | 브랜치 | 상태 | 머지 |
|------|--------|------|------|
| ① | feature/llm-api | ✅ | ⬜ |
| ② | feature/vector-search | ✅ | ⬜ |
| ③ | feature/sentiment-analysis | ✅ | ⬜ |
| ④ | feature/pdf-pipeline | ✅ | ⬜ |
| ⑤ | feature/ensemble-prediction | ✅ | ⬜ |
| ⑥ | feature/adaptive-feedback | ⬜ | ⬜ |
| ⑦ | feature/multi-agent | ⬜ | ⬜ |
| ⑧ | feature/timeseries | ⬜ | ⬜ |
| ⑨ | feature/claude-md-hierarchy | ⬜ | ⬜ |
| ⑩ | feature/harness-orchestration | ⬜ | ⬜ |
| ⑪ | feature/token-optimization | ⬜ | ⬜ |

---

## Phase 3: 문서 완성 ⬜ 대기

| 작업 | 상태 |
|------|------|
| 메인 README.md 최종 업데이트 | ⬜ |
| 각 AI 폴더 README.md 검수 | ⬜ |
| ERD + 관계도 최종 검수 | ⬜ |

---

## 이어서 작업하기 (세션 복구 가이드)

1. 이 파일(docs/PROGRESS.md)을 읽어서 현재 상태 파악
2. docs/PROJECT_PLAN.md 읽어서 전체 설계 확인
3. README.md 읽어서 프로젝트 구조 확인
4. 🔄 표시된 Phase의 ⬜ 항목부터 이어서 진행
5. 작업 완료 시 이 문서의 상태를 ✅로 업데이트

### 핵심 결정사항 요약

- **BE**: Spring Boot 3.4 + Java 21 + JPA + QueryDSL
- **FE**: React 19 + Vite + TypeScript + TailwindCSS
- **DB**: PostgreSQL 16 + pgvector + Redis 7
- **구조**: 포트폴리오 1개 프로젝트 + AI 기술 폴더별 README.md
- **브랜치**: feature 브랜치에서 개발 → main 머지
- **GitHub**: https://github.com/Raconer/ai-base (public, Raconer)
