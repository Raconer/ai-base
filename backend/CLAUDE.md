# AI Base — Backend CLAUDE.md

## 프로젝트 개요
Spring Boot 3.4 + Java 21 기반 REST API 서버.
포트폴리오 웹앱의 백엔드 + AI 기술 통합 레퍼런스.

## 기술 스택
- Java 21 / Spring Boot 3.4
- Spring Data JPA + QueryDSL 5.1
- Spring Security + JWT (jjwt 0.12.6)
- PostgreSQL 16 + pgvector + Redis 7
- PDFBox 3.0 / Springdoc OpenAPI 2.8

---

## 패키지 구조
```
com.aibase
├── config/         설정 (Security, Jpa, QueryDsl, Cors, Swagger, Redis)
├── common/
│   ├── entity/     BaseEntity (id, createdAt, updatedAt)
│   ├── dto/        ApiResponse<T>, PageResponse<T>
│   ├── exception/  BusinessException, GlobalExceptionHandler
│   └── security/   JwtTokenProvider, JwtAuthenticationFilter, JwtUserDetails
├── domain/
│   ├── user/       User 인증 도메인
│   ├── post/       게시글 + 태그 도메인
│   ├── resume/     이력서 도메인
│   └── pdf/        PDF 업로드·청킹 도메인
└── ai/             AI 기술 모음 (feature 브랜치에서 추가)
```

---

## 컨벤션

### 응답 형식
모든 API는 `ApiResponse<T>`로 감싸서 반환한다.
```java
return ResponseEntity.ok(ApiResponse.ok(data));
return ResponseEntity.ok(ApiResponse.ok("메시지", data));
return ResponseEntity.ok(ApiResponse.ok("메시지"));
```

### 페이지네이션
`PageResponse.from(page)` 사용. PageRequest는 컨트롤러에서 생성.

### 예외 처리
`BusinessException(message, HttpStatus)` 또는 static factory 메서드 사용:
```java
BusinessException.notFound("리소스를 찾을 수 없습니다")
BusinessException.badRequest("잘못된 요청입니다")
BusinessException.unauthorized("인증이 필요합니다")
BusinessException.conflict("이미 존재합니다")
```

### 도메인 계층
- **Entity**: 비즈니스 메서드 포함 (update, increment 등)
- **Repository**: JpaRepository 상속, 복잡 쿼리는 QueryDSL
- **Service**: `@Transactional(readOnly = true)` 기본, 쓰기는 `@Transactional`
- **Controller**: 요청/응답 변환만 담당, 비즈니스 로직 없음
- **DTO**: Java record 사용, `from(Entity)` static factory 패턴

### 인증
`@AuthenticationPrincipal JwtUserDetails userDetails`로 현재 사용자 주입.
`userDetails.getUserId()`로 userId 획득.

### 보안
- Public 엔드포인트: `GET /api/posts/**`, `POST /api/auth/**`
- 나머지 전부 JWT 인증 필요

---

## 로컬 실행

### 의존 서비스 (Docker)
```bash
docker compose -f docker/docker-compose.yml up -d postgres redis
```

### 빌드 & 실행
```bash
cd backend
./gradlew bootRun
```

### Swagger UI
http://localhost:8080/swagger-ui/index.html

---

## 모델 선택 가이드 (토큰 절약)
| 작업 | 권장 모델 |
|------|-----------|
| 단순 CRUD 생성, 타입 수정 | haiku |
| 로직 구현, 리팩토링, 버그 수정 | sonnet |
| 아키텍처 설계, 복잡한 AI 알고리즘 | opus |

Claude Code에서 `--model haiku` / `--model sonnet` / `--model opus` 플래그로 지정.

---

## AI 기술 추가 가이드 (feature 브랜치)
`com.aibase.ai` 패키지 아래에 기술별 폴더 생성:
```
ai/
├── llm/            LLM API 연동
├── vectorsearch/   pgvector 시맨틱 검색
├── sentiment/      감성 분석
├── ensemble/       앙상블 예측
├── feedback/       적응형 피드백 루프
├── multiagent/     멀티 에이전트
└── timeseries/     시계열 분석
```
각 폴더에 `README.md` 필수 (기술 설명, 적용 방법, 예시 코드).
