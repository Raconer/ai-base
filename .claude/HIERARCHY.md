# CLAUDE.md 계층 구조 가이드

> AI Base 프로젝트의 Claude Code 컨텍스트 관리 구조.

---

## 계층 구조

```
루트 CLAUDE.md                ← 전역 최소 규칙 (모든 세션에서 로드)
├── backend/CLAUDE.md         ← BE 전용 컨벤션 (backend/ 작업 시 로드)
├── frontend/CLAUDE.md        ← FE 전용 컨벤션 (frontend/ 작업 시 로드)
└── .claude/
    ├── settings.json         ← Hook 정의 (자동화된 가드레일)
    ├── HIERARCHY.md          ← 이 파일 (계층 구조 문서)
    └── hooks/
        ├── pre-edit.sh       ← 편집 전 검사 (Lombok, @Autowired 차단 등)
        ├── post-edit.sh      ← 편집 후 후처리
        └── stop-check.sh     ← 세션 종료 전 PROGRESS.md 업데이트 확인
```

---

## 로드 우선순위

Claude Code는 현재 작업 디렉토리에서 상위 방향으로 CLAUDE.md를 탐색하며
**하위 → 상위** 순서로 우선순위를 가진다.

| 우선순위 | 파일 | 적용 범위 |
|---------|------|----------|
| 1 (최고) | `backend/CLAUDE.md` | backend/ 디렉토리 작업 시 |
| 1 (최고) | `frontend/CLAUDE.md` | frontend/ 디렉토리 작업 시 |
| 2 | `CLAUDE.md` (루트) | 모든 작업 공통 |
| 3 (최저) | `~/.claude/CLAUDE.md` | 사용자 전역 설정 |

---

## 각 CLAUDE.md 역할 분리

### 루트 CLAUDE.md (전역 최소 규칙)
- 프로젝트 개요 및 디렉토리 구조
- 브랜치 전략 (main → feature/* → main)
- 세션 복구 절차 (PROGRESS.md → PROJECT_PLAN.md)
- Hook exit 코드 규칙
- 하네스 자동 관리 원칙

### backend/CLAUDE.md (BE 컨벤션)
- 패키지 구조 (`com.aibase.*`)
- 응답 형식 (`ApiResponse<T>` 래핑)
- 예외 처리 (`BusinessException`)
- 인증 (`JwtUserDetails`)
- AI 기술 추가 가이드 (`com.aibase.ai.*`)

### frontend/CLAUDE.md (FE 컨벤션)
- 컴포넌트 구조 및 네이밍
- 상태 관리 (Zustand)
- API 호출 패턴 (TanStack Query)
- 라우팅 및 레이아웃

---

## Hook 동작 방식

### PreToolUse (Edit | Write 전)
`pre-edit.sh`가 실행되어 Java 소스 파일에 한해 아래 항목을 차단:

| 위반 패턴 | 차단 이유 |
|----------|---------|
| `@Autowired` (프로덕션) | 생성자 주입 강제 |
| `import lombok` | Lombok 사용 금지 (Java record / 수동 구현) |
| `System.out.println` | Logger 사용 강제 |
| `git push --force` | 강제 푸시 금지 |

> `.md`, `.yml`, `.json`, `.sh` 파일은 검사 제외.

### PostToolUse (Edit | Write 후)
`post-edit.sh`가 실행되어 편집 후 후처리 수행.

### Stop (세션 종료 전)
`stop-check.sh`가 실행되어 PROGRESS.md 업데이트 여부를 확인.

---

## 새 CLAUDE.md 추가 기준

새 서브 모듈에 CLAUDE.md를 추가하는 기준:

1. **3개 이상의 컨벤션 규칙**이 해당 모듈에만 적용될 때
2. **다른 모듈과 충돌 가능성**이 있는 규칙이 있을 때
3. **독립적으로 작업**할 가능성이 높을 때

조건을 충족하지 않으면 상위 CLAUDE.md에 섹션으로 추가.

---

## 하네스 자동 관리 원칙

같은 실수가 **2번 이상** 반복될 때 `harness-builder` 에이전트를 호출하여
`.claude/settings.json`에 Hook을 자동으로 추가한다.

현재 차단 중인 패턴:
- `@Autowired` (필드 주입)
- `import lombok`
- `System.out.println`
- `git push --force`
