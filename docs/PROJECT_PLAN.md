# AI Base - 프로젝트 기획서

> **작성일**: 2026-04-07
> **프로젝트명**: AI Base
> **GitHub**: https://github.com/Raconer/ai-base (public)
> **목적**: 실제 프로젝트에서 추출한 AI 기술들을 풀스택 포트폴리오에 통합한 레퍼런스 저장소

---

## 1. 프로젝트 개요

### 1.1 배경

5개 실전 프로젝트에서 사용된 AI 기술을 분석하고, 하나의 포트폴리오 웹 애플리케이션에 통합 적용한다.

| 출처 프로젝트 | AI 기술 | 스택 |
|--------------|---------|------|
| **etf-platform** | MPT 포트폴리오 최적화, Sharpe Ratio, 리스크 스코어링 | FastAPI + Next.js + MySQL |
| **lotto** | Bayesian, Poisson, Markov Chain, 앙상블 투표 | FastAPI + React + PostgreSQL |
| **novel_studio** | Gemini LLM, 12단계 생성 파이프라인, 적응형 피드백 루프 | FastAPI + Next.js + MySQL |
| **stock_traders** | Claude API 감성분석, pgvector 벡터검색, TimescaleDB | FastAPI + Next.js + PostgreSQL |
| **history** | (AI 없음 - Spring Boot + React 구조 참고) | Spring Boot + React + PostgreSQL |

### 1.2 목표

- AI 기술별 독립적인 학습/참고가 가능한 레퍼런스 구축
- 각 기술 폴더에 README.md로 상세 설명 제공
- Feature 브랜치로 기술별 개발 이력 관리
- Claude Code 개발 방법론 (CLAUDE.md, 하네스, 토큰 절약) 문서화

---

## 2. 기술 스택

### 2.1 Backend

| 항목 | 기술 | 버전 |
|------|------|------|
| Language | Java | 21 LTS |
| Framework | Spring Boot | 3.4.x |
| ORM | Spring Data JPA + Hibernate 6 | - |
| Query | QueryDSL | 5.1.0 |
| Auth | Spring Security + JWT (jjwt) | 0.12.6 |
| Validation | Jakarta Validation | - |
| API Docs | Springdoc OpenAPI (Swagger) | 2.8.x |
| Build | Gradle (Kotlin DSL) | 8.x |
| AI SDK | Anthropic Java SDK / REST | - |

### 2.2 Frontend

| 항목 | 기술 | 버전 |
|------|------|------|
| Framework | React | 19.x |
| Build Tool | Vite | 6.x |
| Language | TypeScript | 5.x |
| Routing | React Router DOM | 7.x |
| State | Zustand | 5.x |
| Server State | TanStack React Query | 5.x |
| HTTP | Axios | 1.x |
| Styling | TailwindCSS | 4.x |
| Charts | Recharts | 2.x |

### 2.3 Database

| 항목 | 기술 | 버전 | 용도 |
|------|------|------|------|
| Primary DB | PostgreSQL | 16 | 메인 데이터 저장 |
| Vector Extension | pgvector | 0.7.x | 벡터 임베딩 + 시맨틱 검색 |
| Cache | Redis | 7.x | 캐시, 세션, 작업 큐 |

### 2.4 Infrastructure

| 항목 | 기술 |
|------|------|
| Container | Docker + Docker Compose |
| BE Container | Eclipse Temurin JDK 21 Alpine |
| FE Container | Node 22 (build) + Nginx Alpine (serve) |
| CI/CD | GitHub Actions (예정) |

---

## 3. 핵심 기능

### 3.1 포트폴리오 기본 기능

| 기능 | 설명 | API |
|------|------|-----|
| **글 작성 (Blog)** | Markdown 기반 글 CRUD | POST/GET/PUT/DELETE /api/posts |
| **이력서 관리** | 이력서 CRUD + 섹션별 관리 | POST/GET/PUT/DELETE /api/resumes |
| **PDF 분석** | PDF 업로드 → 텍스트 추출 → DB 저장 | POST /api/pdf/upload, /api/pdf/analyze |
| **PDF 생성** | 이력서/글 → PDF 변환 다운로드 | GET /api/pdf/export/{type}/{id} |
| **인증** | JWT 로그인/회원가입 | POST /api/auth/login, /register, /refresh |
| **About/Skills** | 프로필 + 기술 스택 관리 | GET/PUT /api/profile |

### 3.2 AI 적용 기능

| 기능 | AI 기술 | 설명 |
|------|---------|------|
| **글 AI 교정** | LLM API | 오타 수정, 문법 교정, 톤 개선 |
| **이력서 요약** | LLM API | 이력서 핵심 내용 자동 요약 |
| **시맨틱 검색** | Vector Search + RAG | PDF/글 내용 기반 의미 검색 |
| **톤 분석** | Sentiment Analysis | 글의 긍정/부정/중립 스코어링 |
| **콘텐츠 추천** | Ensemble Prediction | 유사 글/인기글 추천 |
| **글 품질 루프** | Adaptive Feedback | 작성 → AI 평가 → 수정 제안 → 재평가 |
| **자동 분류/태그** | Multi-Agent | 글 분석 → 카테고리/태그 자동 생성 |
| **방문자 트렌드** | TimeSeries | 방문자 통계 + 트렌드 예측 |

---

## 4. DB 설계 (ERD)

### 4.1 테이블 관계도

```
┌─────────────────┐
│     users        │
├─────────────────┤
│ id (PK)         │
│ email (UQ)      │
│ password_hash   │
│ name            │
│ role            │──────────────────────────────────────┐
│ bio             │                                      │
│ avatar_url      │                                      │
│ created_at      │                                      │
│ updated_at      │                                      │
└────────┬────────┘                                      │
         │                                               │
         │ 1:N                                           │
         ├──────────────────────┐                        │
         │                      │                        │
         ▼                      ▼                        ▼
┌─────────────────┐   ┌─────────────────┐   ┌───────────────────┐
│     posts        │   │    resumes       │   │   ai_task_logs     │
├─────────────────┤   ├─────────────────┤   ├───────────────────┤
│ id (PK)         │   │ id (PK)         │   │ id (PK)           │
│ user_id (FK)    │   │ user_id (FK)    │   │ user_id (FK)      │
│ title           │   │ title           │   │ task_type          │
│ content (TEXT)  │   │ summary (TEXT)  │   │ input_text (TEXT)  │
│ status          │   │ skills (JSONB)  │   │ output_text (TEXT) │
│ category        │   │ experience(JSONB│   │ model_used         │
│ sentiment_score │   │ education(JSONB)│   │ tokens_used        │
│ ai_corrected    │   │ pdf_url         │   │ duration_ms        │
│ view_count      │   │ is_primary      │   │ status             │
│ created_at      │   │ created_at      │   │ created_at         │
│ updated_at      │   │ updated_at      │   └───────────────────┘
└────────┬────────┘   └────────┬────────┘
         │                     │
         │ N:M                 │ 1:N
         ▼                     ▼
┌─────────────────┐   ┌───────────────────┐
│   post_tags      │   │  pdf_documents     │
├─────────────────┤   ├───────────────────┤
│ id (PK)         │   │ id (PK)           │
│ post_id (FK)    │   │ resume_id (FK)    │ ← nullable (글/이력서 공용)
│ tag_id (FK)     │   │ post_id (FK)      │ ← nullable
│ created_at      │   │ filename          │
└────────┬────────┘   │ original_text(TEXT│
         │            │ chunk_index       │
         ▼            │ chunk_text (TEXT)  │
┌─────────────────┐   │ embedding vector( │ ← pgvector (1536차원)
│     tags         │   │   1536)           │
├─────────────────┤   │ created_at        │
│ id (PK)         │   └───────────────────┘
│ name (UQ)       │
│ category        │
│ ai_generated    │   ┌───────────────────┐
│ created_at      │   │  visitor_stats     │
└─────────────────┘   ├───────────────────┤
                      │ id (PK)           │
                      │ date (UQ)         │
                      │ page_views        │
                      │ unique_visitors   │
                      │ avg_duration_sec  │
                      │ top_pages (JSONB) │
                      │ referrers (JSONB) │
                      │ created_at        │
                      └───────────────────┘
```

### 4.2 테이블 상세

| 테이블 | 용도 | 주요 인덱스 |
|--------|------|------------|
| **users** | 사용자 인증 + 프로필 | email (UNIQUE) |
| **posts** | 블로그 글 | user_id, status, category, created_at |
| **tags** | 태그 (AI 자동 생성 포함) | name (UNIQUE), category |
| **post_tags** | 글-태그 N:M 매핑 | (post_id, tag_id) UNIQUE |
| **resumes** | 이력서 관리 | user_id, is_primary |
| **pdf_documents** | PDF 청크 + 벡터 임베딩 | resume_id, post_id, embedding (ivfflat) |
| **ai_task_logs** | AI 작업 이력 추적 | user_id, task_type, created_at |
| **visitor_stats** | 방문자 시계열 데이터 | date (UNIQUE) |

### 4.3 pgvector 설정

```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- PDF 청크 임베딩 컬럼
ALTER TABLE pdf_documents ADD COLUMN embedding vector(1536);

-- IVFFlat 인덱스 (코사인 유사도)
CREATE INDEX idx_pdf_embedding ON pdf_documents
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

## 5. AI 기술 관계도

```
┌──────────────────────────────────────────────────────────────────┐
│                        사용자 요청                                 │
│         (글 작성 / 이력서 관리 / PDF 업로드 / 검색)                   │
└─────────┬────────────────────────────────┬───────────────────────┘
          │                                │
          ▼                                ▼
┌──────────────────┐            ┌─────────────────────┐
│  ① LLM API       │◄──────────│  ⑥ Adaptive         │
│                  │   피드백    │    Feedback          │
│  - 글 AI 교정    │   루프     │                     │
│  - 이력서 요약   │            │  - 글 품질 평가      │
│  - 오타 수정     │            │  - 수정 제안         │
│                  │            │  - 재평가 수렴       │
└───────┬──────────┘            └─────────────────────┘
        │
        ├──────────────────┐
        ▼                  ▼
┌───────────────┐  ┌────────────────┐
│ ③ Sentiment   │  │ ④ PDF Pipeline │
│   Analysis    │  │                │
│               │  │ - PDF → 텍스트 │
│ - 글 톤 분석  │  │ - 텍스트 → DB  │
│ - 스코어링    │  │ - DB → PDF     │
└───────────────┘  └───────┬────────┘
                           │ 텍스트 청크 + 임베딩
                           ▼
                  ┌─────────────────┐
                  │ ② Vector Search │
                  │    + RAG        │
                  │                 │
                  │ - pgvector      │
                  │ - 코사인 유사도 │
                  │ - 시맨틱 검색   │
                  └────────┬────────┘
                           │ 검색/추천 데이터
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
┌───────────────┐  ┌───────────────┐  ┌────────────────┐
│ ⑤ Ensemble    │  │ ⑦ Multi-Agent │  │ ⑧ TimeSeries   │
│  Prediction   │  │   Pipeline    │  │   Analysis     │
│               │  │               │  │                │
│ - 콘텐츠 추천 │  │ - 자동 분류   │  │ - 방문자 통계  │
│ - 인기글 예측 │  │ - 태그 생성   │  │ - 트렌드 예측  │
└───────────────┘  └───────────────┘  └────────────────┘


┌──────────────────────────────────────────────────────┐
│              Claude Code 개발 방법론                    │
├──────────────┬──────────────┬────────────────────────┤
│ ⑨ CLAUDE.md  │ ⑩ Harness    │ ⑪ Token Optimization  │
│   계층 구조   │   오케스트레이션│   토큰 절약 전략       │
├──────────────┼──────────────┼────────────────────────┤
│ - 글로벌     │ - 4~6단계    │ - 모델 티어링          │
│ - 로컬(BE)   │   파이프라인  │   (haiku/sonnet)      │
│ - 로컬(FE)   │ - 에이전트    │ - 파일 기반 통신       │
│ - 모듈별     │   역할 분리   │ - max-turns 제한       │
│ - agents/    │ - 파일 기반   │ - Spec-as-Contract     │
│ - .claude/   │   통신       │ - Pre-Write 훅          │
└──────────────┴──────────────┴────────────────────────┘
```

---

## 6. 디렉토리 구조

```
ai_base/
├── README.md                              ← 전체 목차 + 기술 링크 + ERD + 관계도
├── CLAUDE.md                              ← 루트 Claude Code 규칙
├── .gitignore
│
├── docs/
│   └── PROJECT_PLAN.md                    ← 이 기획서
│
├── backend/
│   ├── CLAUDE.md                          ← BE 전용 컨벤션
│   ├── build.gradle.kts
│   ├── settings.gradle.kts
│   ├── Dockerfile
│   └── src/main/java/com/aibase/
│       ├── AiBaseApplication.java
│       │
│       ├── config/                        ← 설정
│       │   ├── SecurityConfig.java
│       │   ├── JpaConfig.java
│       │   ├── QueryDslConfig.java
│       │   ├── CorsConfig.java
│       │   ├── SwaggerConfig.java
│       │   └── RedisConfig.java
│       │
│       ├── domain/                        ← 도메인 (DDD 스타일)
│       │   ├── user/
│       │   │   ├── entity/User.java
│       │   │   ├── repository/UserRepository.java
│       │   │   ├── service/AuthService.java
│       │   │   ├── controller/AuthController.java
│       │   │   └── dto/
│       │   │
│       │   ├── post/
│       │   │   ├── entity/Post.java, Tag.java, PostTag.java
│       │   │   ├── repository/
│       │   │   ├── service/PostService.java
│       │   │   ├── controller/PostController.java
│       │   │   └── dto/
│       │   │
│       │   ├── resume/
│       │   │   ├── entity/Resume.java
│       │   │   ├── repository/
│       │   │   ├── service/ResumeService.java
│       │   │   ├── controller/ResumeController.java
│       │   │   └── dto/
│       │   │
│       │   └── pdf/
│       │       ├── entity/PdfDocument.java
│       │       ├── repository/
│       │       ├── service/PdfService.java
│       │       ├── controller/PdfController.java
│       │       └── dto/
│       │
│       ├── ai/                            ← AI 기술 모음 (각 폴더에 README.md)
│       │   ├── llm/
│       │   │   ├── README.md              ← LLM API 통합 설명
│       │   │   ├── LlmService.java
│       │   │   ├── LlmConfig.java
│       │   │   └── dto/
│       │   │
│       │   ├── vectorsearch/
│       │   │   ├── README.md              ← 벡터 검색 + RAG 설명
│       │   │   ├── EmbeddingService.java
│       │   │   ├── VectorSearchService.java
│       │   │   └── dto/
│       │   │
│       │   ├── sentiment/
│       │   │   ├── README.md              ← 감성 분석 설명
│       │   │   ├── SentimentService.java
│       │   │   └── dto/
│       │   │
│       │   ├── ensemble/
│       │   │   ├── README.md              ← 앙상블 예측 설명
│       │   │   ├── EnsemblePredictionService.java
│       │   │   └── dto/
│       │   │
│       │   ├── feedback/
│       │   │   ├── README.md              ← 적응형 피드백 설명
│       │   │   ├── FeedbackLoopService.java
│       │   │   └── dto/
│       │   │
│       │   ├── agent/
│       │   │   ├── README.md              ← 멀티 에이전트 설명
│       │   │   ├── AgentOrchestratorService.java
│       │   │   └── dto/
│       │   │
│       │   └── timeseries/
│       │       ├── README.md              ← 시계열 분석 설명
│       │       ├── TimeSeriesService.java
│       │       └── dto/
│       │
│       └── common/
│           ├── entity/BaseEntity.java
│           ├── dto/ApiResponse.java
│           ├── exception/
│           └── security/
│               ├── JwtTokenProvider.java
│               └── JwtAuthenticationFilter.java
│
├── frontend/
│   ├── CLAUDE.md                          ← FE 전용 컨벤션
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── Dockerfile
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       │
│       ├── pages/
│       │   ├── Home.tsx                   ← 포트폴리오 메인
│       │   ├── Blog.tsx                   ← 글 목록
│       │   ├── PostDetail.tsx             ← 글 상세 + AI 교정 UI
│       │   ├── PostEditor.tsx             ← 글 작성/수정
│       │   ├── Resume.tsx                 ← 이력서 관리
│       │   ├── Search.tsx                 ← 시맨틱 검색
│       │   ├── About.tsx                  ← 프로필
│       │   ├── Login.tsx                  ← 로그인
│       │   └── Dashboard.tsx              ← 관리자 대시보드 (통계)
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── Footer.tsx
│       │   ├── ui/                        ← 공통 UI (Button, Input, Card, Modal)
│       │   ├── ai/                        ← AI 관련 컴포넌트
│       │   │   ├── README.md              ← AI 컴포넌트 설명
│       │   │   ├── AiWriter.tsx           ← AI 글 교정 UI
│       │   │   ├── SentimentBadge.tsx     ← 감성 스코어 표시
│       │   │   ├── SemanticSearch.tsx     ← 벡터 검색 UI
│       │   │   └── FeedbackPanel.tsx      ← 품질 피드백 표시
│       │   ├── pdf/
│       │   │   ├── README.md              ← PDF 기능 설명
│       │   │   ├── PdfUploader.tsx
│       │   │   └── PdfViewer.tsx
│       │   ├── charts/
│       │   │   └── VisitorChart.tsx       ← 시계열 차트
│       │   └── resume/
│       │       ├── ResumeEditor.tsx
│       │       └── ResumePreview.tsx
│       │
│       ├── stores/
│       │   ├── useAuth.ts
│       │   ├── useTheme.ts
│       │   └── useNotification.ts
│       │
│       ├── hooks/
│       │   └── useApi.ts
│       │
│       ├── lib/
│       │   ├── api.ts                     ← API 클라이언트
│       │   ├── utils.ts
│       │   └── constants.ts
│       │
│       ├── theme.ts                       ← 디자인 토큰 (dark/light)
│       └── index.css                      ← TailwindCSS 글로벌
│
├── database/
│   ├── init.sql                           ← 스키마 + pgvector 확장
│   └── migrations/                        ← Flyway 마이그레이션 (예정)
│
├── docker/
│   └── docker-compose.yml                 ← PG(5432) + Redis(6379) + BE(8080) + FE(3000)
│
├── agents/                                ← 멀티 에이전트 정의
│   ├── README.md                          ← 에이전트 역할 + 사용법
│   ├── planner.md                         ← 기획 에이전트
│   ├── developer.md                       ← 개발 에이전트
│   ├── reviewer.md                        ← 리뷰 에이전트
│   └── qa.md                              ← QA 에이전트
│
└── harness.md                             ← 하네스 오케스트레이션
```

---

## 7. 브랜치 전략

### 7.1 브랜치 구조

```
main ─────────────────────────────────────────────────────────►
  │
  ├── feature/llm-api ──────────── merge ──┐
  │                                        │
  ├── feature/vector-search ───── merge ───┤
  │                                        │
  ├── feature/sentiment-analysis ─ merge ──┤
  │                                        │
  ├── feature/pdf-pipeline ────── merge ───┤
  │                                        │
  ├── feature/ensemble-prediction  merge ──┤
  │                                        │
  ├── feature/adaptive-feedback ── merge ──┤
  │                                        │
  ├── feature/multi-agent ──────── merge ──┤
  │                                        │
  ├── feature/timeseries ───────── merge ──┤
  │                                        │
  ├── feature/claude-md-hierarchy  merge ──┤
  │                                        │
  ├── feature/harness-orchestration merge ─┤
  │                                        │
  └── feature/token-optimization ── merge ─┘
```

### 7.2 브랜치 규칙

- **main**: 항상 동작하는 상태 유지
- **feature/**: main에서 분기 → 작업 완료 → main으로 머지
- **커밋 메시지**: `feat: [기술명] 기능 설명` 형식
- **머지 순서**: 의존성에 따라 순차 진행 (LLM → Vector → Sentiment → ...)

### 7.3 Feature 브랜치 상세

| 순서 | 브랜치 | 핵심 파일 | 포트폴리오 기능 |
|------|--------|----------|----------------|
| ① | `feature/llm-api` | ai/llm/, components/ai/AiWriter | 글 AI 교정, 이력서 요약 |
| ② | `feature/vector-search` | ai/vectorsearch/, SemanticSearch | PDF→임베딩→RAG 시맨틱 검색 |
| ③ | `feature/sentiment-analysis` | ai/sentiment/, SentimentBadge | 글 톤 분석 스코어링 |
| ④ | `feature/pdf-pipeline` | domain/pdf/, PdfUploader | PDF 분석/생성 파이프라인 |
| ⑤ | `feature/ensemble-prediction` | ai/ensemble/ | 콘텐츠 추천, 인기글 예측 |
| ⑥ | `feature/adaptive-feedback` | ai/feedback/, FeedbackPanel | 글 품질 루프 (평가→수정→재평가) |
| ⑦ | `feature/multi-agent` | ai/agent/ | 자동 분류, 태그 생성 |
| ⑧ | `feature/timeseries` | ai/timeseries/, VisitorChart | 방문자 통계 + 트렌드 예측 |
| ⑨ | `feature/claude-md-hierarchy` | CLAUDE.md × 3+, .claude/ | CLAUDE.md 계층 구조 문서 |
| ⑩ | `feature/harness-orchestration` | agents/, harness.md | 하네스 파이프라인 문서 |
| ⑪ | `feature/token-optimization` | .claude/settings.json | 토큰 절약 전략 문서 |

---

## 8. API 엔드포인트 설계

### 8.1 인증 (Auth)

| Method | Path | 설명 |
|--------|------|------|
| POST | /api/auth/register | 회원가입 |
| POST | /api/auth/login | 로그인 (JWT 발급) |
| POST | /api/auth/refresh | 토큰 갱신 |
| GET | /api/auth/me | 내 정보 조회 |

### 8.2 글 (Posts)

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/posts | 글 목록 (페이징, 검색, 필터) |
| GET | /api/posts/{id} | 글 상세 |
| POST | /api/posts | 글 작성 |
| PUT | /api/posts/{id} | 글 수정 |
| DELETE | /api/posts/{id} | 글 삭제 |
| GET | /api/posts/search?q= | 시맨틱 검색 (벡터) |

### 8.3 이력서 (Resumes)

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/resumes | 이력서 목록 |
| GET | /api/resumes/{id} | 이력서 상세 |
| POST | /api/resumes | 이력서 생성 |
| PUT | /api/resumes/{id} | 이력서 수정 |
| DELETE | /api/resumes/{id} | 이력서 삭제 |

### 8.4 PDF

| Method | Path | 설명 |
|--------|------|------|
| POST | /api/pdf/upload | PDF 업로드 → 텍스트 추출 → 임베딩 |
| GET | /api/pdf/{id}/chunks | PDF 청크 목록 |
| GET | /api/pdf/export/resume/{id} | 이력서 → PDF 다운로드 |
| GET | /api/pdf/export/post/{id} | 글 → PDF 다운로드 |

### 8.5 AI

| Method | Path | 설명 | AI 기술 |
|--------|------|------|---------|
| POST | /api/ai/correct | 글 AI 교정 | LLM API |
| POST | /api/ai/summarize | 텍스트 요약 | LLM API |
| POST | /api/ai/sentiment | 감성 분석 | Sentiment |
| GET | /api/ai/recommend?postId= | 관련 콘텐츠 추천 | Ensemble |
| POST | /api/ai/feedback | 글 품질 평가 | Adaptive Feedback |
| POST | /api/ai/classify | 자동 분류 + 태그 | Multi-Agent |
| GET | /api/ai/search?q= | RAG 시맨틱 검색 | Vector Search |

### 8.6 통계 (Stats)

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/stats/visitors | 방문자 통계 |
| GET | /api/stats/trend | 트렌드 예측 |
| GET | /api/stats/popular | 인기 콘텐츠 |

### 8.7 프로필 (Profile)

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/profile | 프로필 조회 |
| PUT | /api/profile | 프로필 수정 |
| GET | /api/profile/skills | 기술 스택 조회 |

---

## 9. 보안 설계

### 9.1 인증/인가

| 항목 | 구현 |
|------|------|
| 비밀번호 해싱 | BCrypt (strength 12) |
| 토큰 | JWT (HS512, Access 30min, Refresh 7d) |
| 인가 | Spring Security + @PreAuthorize |
| CORS | 허용 Origin: localhost:3000 (개발), 도메인 (운영) |
| CSRF | 비활성화 (JWT 기반 Stateless) |

### 9.2 보안 체크리스트

- [ ] SQL Injection → JPA Parameterized Query + QueryDSL
- [ ] XSS → React 자동 이스케이프 + Content-Security-Policy
- [ ] File Upload → 확장자 검증 (PDF only) + 크기 제한 (10MB)
- [ ] API Rate Limiting → Spring Security + Redis 기반
- [ ] 환경변수 → .env (gitignore), Docker secrets (운영)
- [ ] HTTPS → Nginx TLS 종단 (운영)

---

## 10. 디자인 패턴

### 10.1 Backend 패턴

| 패턴 | 적용 위치 | 설명 |
|------|----------|------|
| **DDD (Domain-Driven Design)** | domain/ | 도메인별 패키지 분리 (user, post, resume, pdf) |
| **Repository Pattern** | repository/ | Spring Data JPA + QueryDSL Custom Repository |
| **Service Layer** | service/ | 비즈니스 로직 캡슐화 |
| **DTO Pattern** | dto/ | 요청/응답 객체 분리 (Entity 직접 노출 금지) |
| **Strategy Pattern** | ai/ | AI 서비스별 인터페이스 + 구현체 분리 |
| **Builder Pattern** | QueryDSL | BooleanBuilder 동적 쿼리 |
| **Template Method** | ai/feedback/ | 피드백 루프 골격 정의 + 단계별 커스터마이징 |
| **Observer Pattern** | event/ | Spring ApplicationEvent (AI 작업 완료 알림) |

### 10.2 Frontend 패턴

| 패턴 | 적용 위치 | 설명 |
|------|----------|------|
| **Atomic Design** | components/ | atoms(ui/) → molecules → organisms → pages |
| **Container/Presenter** | pages/ + components/ | 로직과 렌더링 분리 |
| **Custom Hooks** | hooks/ | 재사용 로직 추상화 (useApi, useDebounce) |
| **Store Pattern** | stores/ | Zustand 상태 관리 (auth, theme, notification) |
| **Compound Component** | components/ui/ | 관련 컴포넌트 묶음 (Modal.Header, Modal.Body) |

### 10.3 AI 패턴

| 패턴 | 적용 기술 | 설명 |
|------|----------|------|
| **Pipeline Pattern** | Multi-Agent | 단계별 처리: 분류 → 태그 → 검증 |
| **Retry with Fallback** | LLM API | 모델 풀 Failover (Claude → Gemini) |
| **Feedback Loop** | Adaptive Feedback | 평가 → 수정 → 재평가 수렴 패턴 |
| **Chunking + Embedding** | Vector Search | 텍스트 분할 → 임베딩 → 벡터 저장 |
| **Ensemble Voting** | Prediction | 다중 모델 가중 투표 |

---

## 11. 실행 계획 (Phase)

### Phase 0: 프로젝트 초기화 ✅ 현재 단계
- [x] 기획서 작성 (이 문서)
- [ ] README.md 작성
- [ ] .gitignore 작성
- [ ] Git 초기화 + GitHub public 레포 생성
- [ ] Initial commit + push

### Phase 1: main 브랜치 — 프로젝트 골격
- [ ] Spring Boot 프로젝트 생성 (build.gradle.kts)
- [ ] React + Vite 프로젝트 생성
- [ ] Docker Compose 설정 (PG + Redis + BE + FE)
- [ ] DB 스키마 (init.sql)
- [ ] CLAUDE.md 계층 구조 (루트 + BE + FE)
- [ ] agents/ + harness.md 기본 구조
- [ ] 도메인 기본 CRUD (User, Post, Resume)
- [ ] JWT 인증 구현
- [ ] FE 기본 페이지 (Home, Blog, Resume, About, Login)

### Phase 2: Feature 브랜치 — AI 기술 적용
- [ ] ① feature/llm-api
- [ ] ② feature/vector-search
- [ ] ③ feature/sentiment-analysis
- [ ] ④ feature/pdf-pipeline
- [ ] ⑤ feature/ensemble-prediction
- [ ] ⑥ feature/adaptive-feedback
- [ ] ⑦ feature/multi-agent
- [ ] ⑧ feature/timeseries
- [ ] ⑨ feature/claude-md-hierarchy
- [ ] ⑩ feature/harness-orchestration
- [ ] ⑪ feature/token-optimization

### Phase 3: 문서 완성
- [ ] 메인 README.md 최종 업데이트 (모든 링크 연결)
- [ ] 각 AI 폴더 README.md 검수
- [ ] ERD + 관계도 최종 검수

---

## 12. 포트 배정

| 서비스 | 포트 | 비고 |
|--------|------|------|
| Frontend (React) | 3000 | Vite dev / Nginx |
| Backend (Spring Boot) | 8080 | Tomcat |
| PostgreSQL | 5432 | Docker |
| Redis | 6379 | Docker |
| Swagger UI | 8080/swagger-ui | BE와 동일 |

> 기존 프로젝트 포트와 충돌하지 않도록 별도 Docker network 사용

---

## 13. 참고: 기존 프로젝트 포트 현황

| 프로젝트 | FE | BE | DB | Redis |
|----------|----|----|-----|-------|
| etf-platform | 3000 | 8080 | 3306 (MySQL) | 6381 |
| lotto | 3003 | 3005 | 5433 (PG) | 3004 |
| novel_studio | 3001 | 8001 | 3307 (MySQL) | 6380 |
| stock_traders | 3002 | 8000 | 5432 (PG) | 6379 |
| history | 3007 | 8084 | 5434 (PG) | 6382 |
| **ai_base** | **3000** | **8080** | **5432** | **6379** |

> 동시 실행 시 포트 충돌 주의. 필요 시 docker-compose.yml에서 호스트 포트 변경.
