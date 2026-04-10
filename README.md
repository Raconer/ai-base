# AI Base

> 실제 5개 프로젝트에서 추출한 AI 기술들을 풀스택 포트폴리오에 통합한 레퍼런스 저장소

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org)
[![pgvector](https://img.shields.io/badge/pgvector-0.7-4169E1)](https://github.com/pgvector/pgvector)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docs.docker.com/compose)

---

## 목차

- [개요](#개요)
- [기술 스택](#기술-스택)
- [AI 기술 목차](#ai-기술-목차)
- [Claude Code 방법론](#claude-code-방법론)
- [DB 설계 (ERD)](#db-설계-erd)
- [AI 기술 관계도](#ai-기술-관계도)
- [디렉토리 구조](#디렉토리-구조)
- [브랜치 가이드](#브랜치-가이드)
- [시작하기](#시작하기)
- [API 엔드포인트](#api-엔드포인트)
- [출처 프로젝트](#출처-프로젝트)

---

## 개요

블로그 글 작성, 이력서 관리, PDF 분석/생성 기능을 갖춘 **포트폴리오 웹 애플리케이션**에
아래 8가지 AI 기술과 3가지 Claude Code 개발 방법론을 단계별로 적용합니다.

### 주요 기능

| 기능 | 설명 | 적용 AI |
|------|------|---------|
| 글 작성 + AI 교정 | Markdown 글 CRUD + AI 오타/문법/톤 교정 | LLM API, Sentiment |
| 이력서 관리 | 이력서 CRUD + AI 요약 + PDF 변환 | LLM API, PDF Pipeline |
| 시맨틱 검색 | PDF/글 내용 기반 의미 검색 | Vector Search + RAG |
| 콘텐츠 추천 | 유사 글/인기글 추천 | Ensemble Prediction |
| 글 품질 루프 | AI 평가 → 수정 제안 → 재평가 수렴 | Adaptive Feedback |
| 자동 분류/태그 | 글 분석 → 카테고리 + 태그 자동 생성 | Multi-Agent |
| 방문자 트렌드 | 통계 시각화 + 트렌드 예측 | TimeSeries |

---

## 기술 스택

### Backend

| 항목 | 기술 |
|------|------|
| Language | Java 21 LTS |
| Framework | Spring Boot 3.4 |
| ORM | Spring Data JPA + Hibernate 6 |
| Query | QueryDSL 5.1 |
| Auth | Spring Security + JWT |
| API Docs | Springdoc OpenAPI (Swagger) |
| Build | Gradle (Kotlin DSL) |

### Frontend

| 항목 | 기술 |
|------|------|
| Framework | React 19 |
| Build | Vite 6 |
| Language | TypeScript 5 |
| State | Zustand 5 + TanStack React Query 5 |
| Routing | React Router DOM 7 |
| Styling | TailwindCSS 4 |
| Charts | Recharts 2 |

### Infrastructure

| 항목 | 기술 |
|------|------|
| Database | PostgreSQL 16 + pgvector 0.7 |
| Cache | Redis 7 |
| Container | Docker Compose |

---

## AI 기술 목차

각 기술은 독립된 폴더에 **README.md**로 상세 설명이 포함되어 있습니다.

### Backend AI 서비스

| # | 기술 | 설명 | README | 브랜치 |
|---|------|------|--------|--------|
| 1 | **LLM API 통합** | Claude/Gemini API 호출, 프롬프트 엔지니어링, 모델 Failover | [README](backend/src/main/java/com/aibase/ai/llm/README.md) | `feature/llm-api` |
| 2 | **벡터 검색 + RAG** | pgvector 임베딩, 코사인 유사도, 시맨틱 검색 | [README](backend/src/main/java/com/aibase/ai/vectorsearch/README.md) | `feature/vector-search` |
| 3 | **감성 분석** | LLM 기반 텍스트 감성 스코어링 (-1.0~1.0) | [README](backend/src/main/java/com/aibase/ai/sentiment/README.md) | `feature/sentiment-analysis` |
| 4 | **앙상블 예측** | 다중 모델 가중 투표, 콘텐츠 추천 | [README](backend/src/main/java/com/aibase/ai/ensemble/README.md) | `feature/ensemble-prediction` |
| 5 | **적응형 피드백** | 평가→수정→재평가 품질 수렴 루프 | [README](backend/src/main/java/com/aibase/ai/feedback/README.md) | `feature/adaptive-feedback` |
| 6 | **멀티 에이전트** | 오케스트레이터 패턴, 단계별 에이전트 체이닝 | [README](backend/src/main/java/com/aibase/ai/agent/README.md) | `feature/multi-agent` |
| 7 | **시계열 분석** | 시계열 데이터 처리, 트렌드 예측 | [README](backend/src/main/java/com/aibase/ai/timeseries/README.md) | `feature/timeseries` |

### Frontend AI 컴포넌트

| # | 컴포넌트 | 설명 | README |
|---|---------|------|--------|
| 1 | **AiWriter** | AI 글 교정 UI (실시간 제안, diff 표시) | [README](frontend/src/components/ai/README.md) |
| 2 | **SemanticSearch** | 벡터 검색 UI (유사도 스코어 표시) | [README](frontend/src/components/ai/README.md) |
| 3 | **SentimentBadge** | 감성 스코어 시각화 (긍정/부정/중립) | [README](frontend/src/components/ai/README.md) |
| 4 | **FeedbackPanel** | 품질 피드백 루프 표시 (점수 + 제안) | [README](frontend/src/components/ai/README.md) |
| 5 | **PdfUploader/Viewer** | PDF 업로드 + 분석 결과 표시 | [README](frontend/src/components/pdf/README.md) |
| 6 | **VisitorChart** | 시계열 방문자 통계 차트 | [README](frontend/src/components/charts/README.md) |

---

## Claude Code 방법론

| # | 주제 | 설명 | README | 브랜치 |
|---|------|------|--------|--------|
| 9 | **CLAUDE.md 계층 구조** | 글로벌/로컬/모듈별 MD 파일 설계 | [README](.claude/HIERARCHY.md) | `feature/claude-md-hierarchy` |
| 10 | **하네스 오케스트레이션** | 멀티 에이전트 파이프라인 설계 | [README](.claude/agents/) | `feature/harness-orchestration` |
| 11 | **토큰 절약 전략** | 모델 티어링, 파일 기반 통신, Pre-Write 훅 | [README](.claude/TOKEN_OPTIMIZATION.md) | `feature/token-optimization` |

---

## DB 설계 (ERD)

```
┌─────────────────┐
│     users        │
├─────────────────┤
│ id (PK)         │
│ email (UQ)      │
│ password_hash   │
│ name            │
│ role            │─────────────────────────────────────────┐
│ bio             │                                         │
│ avatar_url      │                                         │
│ created_at      │                                         │
│ updated_at      │                                         │
└────────┬────────┘                                         │
         │                                                  │
         │ 1:N                                              │
         ├──────────────────────┐                           │
         │                      │                           │
         ▼                      ▼                           ▼
┌─────────────────┐   ┌─────────────────┐      ┌───────────────────┐
│     posts        │   │    resumes       │      │   ai_task_logs     │
├─────────────────┤   ├─────────────────┤      ├───────────────────┤
│ id (PK)         │   │ id (PK)         │      │ id (PK)           │
│ user_id (FK)    │   │ user_id (FK)    │      │ user_id (FK)      │
│ title           │   │ title           │      │ task_type          │
│ content (TEXT)  │   │ summary (TEXT)  │      │ input_text (TEXT)  │
│ status          │   │ skills (JSONB)  │      │ output_text (TEXT) │
│ category        │   │ experience(JSONB│      │ model_used         │
│ sentiment_score │   │ education(JSONB)│      │ tokens_used        │
│ ai_corrected    │   │ pdf_url         │      │ duration_ms        │
│ view_count      │   │ is_primary      │      │ status             │
│ created_at      │   │ created_at      │      │ created_at         │
│ updated_at      │   │ updated_at      │      └───────────────────┘
└────────┬────────┘   └────────┬────────┘
         │                     │
         │ N:M                 │ 1:N
         ▼                     ▼
┌─────────────────┐   ┌───────────────────┐
│   post_tags      │   │  pdf_documents     │
├─────────────────┤   ├───────────────────┤
│ id (PK)         │   │ id (PK)           │
│ post_id (FK)    │   │ resume_id (FK)    │ ← nullable
│ tag_id (FK)     │   │ post_id (FK)      │ ← nullable
│ created_at      │   │ filename          │
└────────┬────────┘   │ original_text(TEXT│
         │            │ chunk_index       │
         ▼            │ chunk_text (TEXT)  │
┌─────────────────┐   │ embedding vector( │ ← pgvector (1536)
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

### 테이블 요약

| 테이블 | 용도 | 레코드 규모 |
|--------|------|------------|
| **users** | 사용자 인증 + 프로필 | ~10 |
| **posts** | 블로그 글 | ~100-1000 |
| **tags** | 태그 (수동 + AI 생성) | ~100 |
| **post_tags** | 글-태그 N:M | ~500 |
| **resumes** | 이력서 | ~5-10 |
| **pdf_documents** | PDF 청크 + 벡터 임베딩 | ~1000-10000 |
| **ai_task_logs** | AI 작업 이력 | ~1000+ |
| **visitor_stats** | 방문자 시계열 | ~365/year |

---

## AI 기술 관계도

```
┌──────────────────────────────────────────────────────────────────┐
│                        사용자 요청                                 │
│          (글 작성 / 이력서 관리 / PDF 업로드 / 검색)                  │
└─────────┬────────────────────────────────┬───────────────────────┘
          │                                │
          ▼                                ▼
┌──────────────────┐            ┌─────────────────────┐
│  1. LLM API      │◄──────────│  6. Adaptive        │
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
│ 3. Sentiment  │  │ 4. PDF         │
│   Analysis    │  │   Pipeline     │
│               │  │                │
│ - 글 톤 분석  │  │ - PDF → 텍스트 │
│ - 스코어링    │  │ - 텍스트 → DB  │
└───────────────┘  │ - DB → PDF     │
                   └───────┬────────┘
                           │ 텍스트 청크 + 임베딩
                           ▼
                  ┌─────────────────┐
                  │ 2. Vector Search│
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
│ 5. Ensemble   │  │ 7. Multi-Agent│  │ 8. TimeSeries  │
│  Prediction   │  │   Pipeline    │  │   Analysis     │
│               │  │               │  │                │
│ - 콘텐츠 추천 │  │ - 자동 분류   │  │ - 방문자 통계  │
│ - 인기글 예측 │  │ - 태그 생성   │  │ - 트렌드 예측  │
└───────────────┘  └───────────────┘  └────────────────┘


┌──────────────────────────────────────────────────────┐
│              Claude Code 개발 방법론                    │
├──────────────┬──────────────┬────────────────────────┤
│ 9. CLAUDE.md │ 10. Harness  │ 11. Token              │
│   계층 구조   │ 오케스트레이션│    Optimization        │
└──────────────┴──────────────┴────────────────────────┘
```

### 기술 간 의존성

```
① LLM API ─────────► 모든 AI 기술의 기반 (필수 선행)
     │
     ├─► ② Vector Search ──► RAG 검색 (LLM + 임베딩 필요)
     │
     ├─► ③ Sentiment ──────► LLM으로 감성 분석
     │
     ├─► ④ PDF Pipeline ──► 텍스트 추출 → ② 임베딩으로 전달
     │
     ├─► ⑤ Ensemble ──────► ② 벡터 유사도 기반 추천
     │
     ├─► ⑥ Adaptive Feedback ► LLM 평가 + 수정 루프
     │
     └─► ⑦ Multi-Agent ───► 여러 LLM 호출 오케스트레이션

⑧ TimeSeries ─────────► 독립 (LLM 불필요, 통계 기반)
⑨⑩⑪ 방법론 ──────────► 독립 (문서 + 설정)
```

---

## 디렉토리 구조

```
ai_base/
├── README.md                    ← 이 파일
├── CLAUDE.md                    ← 루트 Claude Code 규칙
├── .gitignore
│
├── docs/
│   ├── PROJECT_PLAN.md          ← 프로젝트 기획서
│   ├── claude-md-hierarchy.md   ← CLAUDE.md 계층 구조 가이드
│   ├── harness-orchestration.md ← 하네스 AI 가이드
│   └── token-optimization.md    ← 토큰 절약 전략 가이드
│
├── backend/                     ← Spring Boot 3.4 + Java 21
│   ├── CLAUDE.md
│   ├── build.gradle.kts
│   ├── Dockerfile
│   └── src/main/java/com/aibase/
│       ├── config/              ← Security, JPA, QueryDSL, CORS
│       ├── domain/              ← user/, post/, resume/, pdf/
│       ├── ai/                  ← AI 기술 (각 폴더에 README.md)
│       │   ├── llm/
│       │   ├── vectorsearch/
│       │   ├── sentiment/
│       │   ├── ensemble/
│       │   ├── feedback/
│       │   ├── agent/
│       │   └── timeseries/
│       └── common/              ← BaseEntity, ApiResponse, Security
│
├── frontend/                    ← React 19 + Vite + TypeScript
│   ├── CLAUDE.md
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── pages/               ← Home, Blog, Resume, Search, About
│       ├── components/
│       │   ├── ai/              ← AI 컴포넌트 (README.md 포함)
│       │   ├── pdf/             ← PDF 컴포넌트 (README.md 포함)
│       │   ├── charts/          ← 차트 컴포넌트
│       │   └── ui/              ← 공통 UI
│       ├── stores/              ← Zustand (auth, theme)
│       └── lib/                 ← API client, utils
│
├── database/
│   └── init.sql                 ← 스키마 + pgvector 확장
│
├── docker/
│   └── docker-compose.yml       ← PG + Redis + BE + FE
│
└── .claude/                     ← Claude Code 방법론
    ├── HIERARCHY.md             ← CLAUDE.md 계층 구조
    ├── TOKEN_OPTIMIZATION.md   ← 토큰 절약 전략
    ├── agents/                  ← 전문 에이전트 정의
    │   ├── code-reviewer.md
    │   ├── harness-builder.md
    │   └── test-writer.md
    ├── hooks/                   ← Pre/Post 편집 훅
    └── settings.json            ← 훅 설정 + 모델 티어링
```

---

## 브랜치 가이드

각 AI 기술은 feature 브랜치에서 개발 후 main으로 머지됩니다.

### AI 기술 브랜치

| 순서 | 브랜치 | 기술 | 난이도 | 핵심 라이브러리 | 출처 |
|------|--------|------|--------|----------------|------|
| 1 | `feature/llm-api` | LLM API 통합 | ★★☆☆ | Anthropic SDK | novel_studio, stock_traders |
| 2 | `feature/vector-search` | 벡터 검색 + RAG | ★★★☆ | pgvector, Embedding API | stock_traders |
| 3 | `feature/sentiment-analysis` | 감성 분석 | ★★☆☆ | Anthropic SDK | stock_traders |
| 4 | `feature/pdf-pipeline` | PDF 분석/생성 | ★★★☆ | Apache PDFBox | novel_studio |
| 5 | `feature/ensemble-prediction` | 앙상블 예측 | ★★★☆ | (순수 Java 통계) | lotto |
| 6 | `feature/adaptive-feedback` | 적응형 피드백 | ★★★☆ | Anthropic SDK | novel_studio |
| 7 | `feature/multi-agent` | 멀티 에이전트 | ★★★★ | Anthropic SDK | novel_studio, etf-platform |
| 8 | `feature/timeseries` | 시계열 분석 | ★★★☆ | (순수 Java 통계) | stock_traders |

### Claude Code 방법론 브랜치

| 순서 | 브랜치 | 내용 | 핵심 파일 |
|------|--------|------|----------|
| 9 | `feature/claude-md-hierarchy` | CLAUDE.md 계층 구조 | CLAUDE.md x3+, .claude/ |
| 10 | `feature/harness-orchestration` | 하네스 오케스트레이션 | .claude/agents/*.md |
| 11 | `feature/token-optimization` | 토큰 절약 전략 | .claude/settings.json |

---

## 시작하기

### 필수 조건

- Docker + Docker Compose
- Java 21+
- Node.js 22+
- Git

### 실행

```bash
# 레포 클론
git clone https://github.com/Raconer/ai-base.git
cd ai-base

# Docker 실행 (PostgreSQL + Redis + Backend + Frontend)
docker compose -f docker/docker-compose.yml up -d

# 접속
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080
# Swagger:   http://localhost:8080/swagger-ui/index.html
```

### 특정 AI 기술 브랜치 확인

```bash
# 예: LLM API 통합 브랜치
git checkout feature/llm-api

# 예: 벡터 검색 + RAG 브랜치
git checkout feature/vector-search
```

---

## API 엔드포인트

### 인증

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 (JWT) |
| POST | `/api/auth/refresh` | 토큰 갱신 |

### 글 (Blog)

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/posts` | 글 목록 (페이징, 필터) |
| GET | `/api/posts/{id}` | 글 상세 |
| POST | `/api/posts` | 글 작성 |
| PUT | `/api/posts/{id}` | 글 수정 |
| DELETE | `/api/posts/{id}` | 글 삭제 |

### 이력서

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/resumes` | 이력서 목록 |
| POST | `/api/resumes` | 이력서 생성 |
| PUT | `/api/resumes/{id}` | 이력서 수정 |
| DELETE | `/api/resumes/{id}` | 이력서 삭제 |

### PDF

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/pdf/upload` | PDF 업로드 → 분석 |
| GET | `/api/pdf/export/resume/{id}` | 이력서 → PDF |
| GET | `/api/pdf/export/post/{id}` | 글 → PDF |

### AI

| Method | Path | 설명 | AI 기술 |
|--------|------|------|---------|
| POST | `/api/ai/correct` | 글 AI 교정 | LLM |
| POST | `/api/ai/summarize` | 텍스트 요약 | LLM |
| POST | `/api/ai/sentiment` | 감성 분석 | Sentiment |
| GET | `/api/ai/recommend` | 콘텐츠 추천 | Ensemble |
| POST | `/api/ai/feedback` | 글 품질 평가 | Feedback |
| POST | `/api/ai/classify` | 자동 분류 + 태그 | Multi-Agent |
| GET | `/api/ai/search?q=` | RAG 시맨틱 검색 | Vector Search |

### 통계

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/stats/visitors` | 방문자 통계 |
| GET | `/api/stats/trend` | 트렌드 예측 |

---

## 출처 프로젝트

이 저장소의 AI 기술들은 아래 실전 프로젝트에서 추출되었습니다.

| 프로젝트 | 설명 | 추출 기술 |
|----------|------|----------|
| **etf-platform** | ETF 투자 플랫폼 | MPT 최적화, Sharpe Ratio, 멀티 에이전트 파이프라인 |
| **lotto** | 로또 예측 시스템 | Bayesian, Poisson, Markov, 앙상블 투표 |
| **novel_studio** | AI 소설 생성기 | Gemini LLM, 12단계 파이프라인, 적응형 피드백, 품질 루프 |
| **stock_traders** | 주식 트레이딩 플랫폼 | Claude 감성분석, pgvector 벡터검색, TimescaleDB |
| **history** | 역사 시각화 플랫폼 | Spring Boot + React 구조 참고 (AI 없음) |

---

## 라이선스

MIT License
