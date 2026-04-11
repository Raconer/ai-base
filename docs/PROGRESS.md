# AI Base - 진행 현황

> 마지막 업데이트: 2026-04-11 (포트폴리오 서비스 흐름 완성)
> 세션이 끊겼을 경우 이 문서를 읽고 이어서 작업하세요.

---

## 현재 상태

- **현재 Phase**: 전체 완료 ✅
- **현재 작업**: 없음 (0~4순위 전부 완료)
- **GitHub**: https://github.com/Raconer/ai-base (public)
- **브랜치**: main (feature/harness-upgrade 머지 완료)

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

## Phase 2: Feature 브랜치 — AI 기술 적용 ✅ 완료

| 순서 | 브랜치 | 상태 | 머지 |
|------|--------|------|------|
| ① | feature/llm-api | ✅ | ✅ |
| ② | feature/vector-search | ✅ | ✅ |
| ③ | feature/sentiment-analysis | ✅ | ✅ |
| ④ | feature/pdf-pipeline | ✅ | ✅ |
| ⑤ | feature/ensemble-prediction | ✅ | ✅ |
| ⑥ | feature/adaptive-feedback | ✅ | ✅ |
| ⑦ | feature/multi-agent | ✅ | ✅ |
| ⑧ | feature/timeseries | ✅ | ✅ |
| ⑨ | feature/claude-md-hierarchy | ✅ | ✅ |
| ⑩ | feature/harness-orchestration | ✅ | ✅ |
| ⑪ | feature/token-optimization | ✅ | ✅ |

---

## Phase 3: 문서 완성 ✅ 완료

| 작업 | 상태 | 비고 |
|------|------|------|
| 메인 README.md 최종 업데이트 | ✅ | 삭제된 agents/, harness.md 참조 수정, .claude/ 경로로 교체 |
| 각 AI 폴더 README.md 검수 | ✅ | 8개 모듈 전부 존재 확인 |
| ERD + 관계도 최종 검수 | ✅ | README.md에 최신 ERD + AI 관계도 포함 |

---

## 추가 작업: 테스트 + CI/CD + 하네스 (2026-04-11)

| 브랜치 | 상태 | 내용 |
|--------|------|------|
| feature/token-optimization-v2 | ✅ 머지 | pre-bash Hook + Stop Hook + 모델 티어링 |
| feature/docker-verify | ✅ 머지 | BE 기동 오류 수정 + 로컬 환경 개선 |
| feature/domain-tests | ✅ 머지 | 도메인 테스트 52개 추가 + AI 서비스 테스트 안정화 |
| feature/github-actions | 🔄 진행 중 | GitHub Actions CI/CD 파이프라인 |
| feature/harness-upgrade | ⬜ 예정 | .claude/ Skills/Agents 내용 개선 |

### feature/domain-tests 주요 변경
- AuthControllerTest, PostControllerTest, ResumeControllerTest, PdfControllerTest 신규
- JpaAuditingConfig 분리 (@WebMvcTest + @EnableJpaAuditing 충돌 해소)
- AgentOrchestratorService, FeedbackLoopService: @Value → 생성자 파라미터 (null 버그 수정)
- AI 서비스 테스트 mockMessage() 호출 패턴 수정 (UnfinishedStubbingException 해소)

---

## Hotfix: SDK 호환성 수정 ✅ 완료 (2026-04-11)

| 브랜치 | 상태 | 내용 |
|--------|------|------|
| feature/hotfix-compatibility | ✅ 머지 | Anthropic SDK TextBlock API 변경, Docker 포트 충돌 해결 |

### 변경 내역
- **LlmService**: `TextBlock` 직접 캐스팅 → `isText()/asText()` API (SDK 호환)
- **AiBaseApplication**: `@EnableJpaRepositories` 추가
- **docker-compose.yml**: 포트 충돌 방지 (PG: 5435, Redis: 6383, BE: 8082, FE: 3007)
- **FE 컴포넌트**: JSX 구조 수정, 타입 정합성 개선

---

## 멀티유저 플랫폼 전환 + 버그수정 ✅ 완료 (2026-04-11)

| 항목 | 상태 | 내용 |
|------|------|------|
| 멀티유저 라우팅 | ✅ | `/:username/*` 경로, UserPortfolio/UserBlog/UserResume 페이지 |
| username 컬럼 추가 | ✅ | Flyway V1 마이그레이션, User 엔티티 + RegisterRequest |
| TokenResponse 개선 | ✅ | id/email/role 포함 → /me 추가 호출 제거 |
| 랜딩 페이지 리디자인 | ✅ | SaaS 스타일, FEATURED_USERS 카드, 기능 그리드 |
| CORS + Security 수정 | ✅ | localhost:3007 허용, `.cors()` Security 연결 |
| 회원가입 버그 수정 | ✅ | Zustand persist hydration 타이밍 → /me 호출 제거로 해결 |
| AuthControllerTest 수정 | ✅ | username 필드 추가, /me 테스트 JwtUserDetails로 교체 |
| AuthServiceTest 신규 | ✅ | register/login 성공·실패 6개 케이스 |
| 전체 테스트 | ✅ | 70개 전부 통과 (실패 0) |
| 포트폴리오 서비스 흐름 | ✅ | 온보딩 UI, username 필터, 경로 수정, /api/ 중복 제거 |
| Docker 프로젝트명 | ✅ | docker → ai_base, 컨테이너 ai_base-* |

### 현재 실행 중인 Docker 스택
| 컨테이너 | 포트 | 상태 |
|---------|------|------|
| ai_base-postgres | 5435 | ✅ |
| ai_base-redis | 6383 | ✅ |
| ai_base-backend | 8085 | ✅ |
| ai_base-frontend | 3007 | ✅ |

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
