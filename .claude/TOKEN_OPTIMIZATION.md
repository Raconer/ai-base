# 토큰 절약 전략 가이드

> AI Base 프로젝트에서 Claude Code 사용 시 토큰을 효율적으로 사용하는 방법.

---

## 1. 모델 티어링 (Model Tiering)

작업 복잡도에 따라 적절한 모델을 선택한다.

| 작업 유형 | 권장 모델 | 비용 |
|---------|---------|------|
| 단순 CRUD, 타입 수정, 파일 이동, 보일러플레이트 | `claude-haiku-4-5` | 가장 저렴 |
| 로직 구현, 리팩토링, 버그 수정, 테스트 작성 | `claude-sonnet-4-6` | 균형 (기본값) |
| 아키텍처 설계, 복잡한 AI 알고리즘, 시스템 설계 | `claude-opus-4-6` | 최고 품질 |

### 이 프로젝트 작업별 모델 선택 기준

| 작업 | 모델 | 이유 |
|------|------|------|
| Entity/DTO 추가 | haiku | 반복적인 패턴, 단순 구조 |
| Repository 작성 | haiku | Spring Data JPA 보일러플레이트 |
| Service 비즈니스 로직 | sonnet | 트랜잭션, 예외처리 판단 필요 |
| Controller + 테스트 | sonnet | API 설계 + MockMvc 패턴 |
| AI 알고리즘 구현 | sonnet~opus | 로직 복잡도에 따라 |
| 아키텍처 결정 | opus | 최고 품질 필요 |
| Docker/CI 설정 | sonnet | 설정 파일 구조 이해 필요 |

---

## 2. Spec-as-Contract

에이전트 간 전체 대화를 공유하지 않고 **파일로 계약**한다.

```
[기존 방식] Planner 대화 전체 → Developer 컨텍스트에 포함 (토큰 낭비)

[최적화 방식]
Planner → spec.md 작성 (파일)
Developer → spec.md만 읽고 구현 (대화 컨텍스트 불필요)
Reviewer → spec.md + 코드만 읽고 리뷰
```

---

## 3. 파일 기반 통신

대형 결과물은 파일에 저장하고 경로만 참조한다.

```bash
# 나쁜 예: 응답 전체를 컨텍스트에 포함
"다음 내용을 분석해줘: [100줄 코드 붙여넣기]"

# 좋은 예: 파일 경로 참조
"backend/src/main/java/com/aibase/ai/llm/LlmService.java를 읽고 분석해줘"
```

---

## 4. 세션 복구 최소화

세션 재시작 시 전체 컨텍스트를 재설명하지 않고
**PROGRESS.md 한 파일**로 복구한다.

```
# 세션 시작 프롬프트 (최소화)
"개발 계속 진행해줘"  → PROGRESS.md 자동 읽음
```

PROGRESS.md가 정확하면 수십 줄의 재설명이 불필요하다.

---

## 5. Subagent 활용

독립 작업을 서브 에이전트에 위임해 메인 컨텍스트를 보호한다.

```
메인 에이전트: 전체 흐름 조율
    ↓ 위임
서브 에이전트 (Explore): 코드베이스 탐색 (메인 컨텍스트 오염 방지)
서브 에이전트 (Plan): 설계 검토 (독립 컨텍스트)
서브 에이전트 (code-reviewer): 코드 리뷰 (독립 판단)
```

---

## 6. Hook을 통한 자동 가드레일

잘못된 코드를 **생성 후 수정**하지 않고 **생성 전에 차단**하여
재작업 토큰을 절약한다.

```
pre-edit.sh   → @Autowired, lombok, System.out.println 차단
pre-bash.sh   → force push, rm -rf, DROP TABLE 차단
post-edit.sh  → Java 파일 수정 시 컴파일 자동 검증
stop-check.sh → 테스트 누락 시 완료 차단, PROGRESS.md 업데이트 확인
```

---

## 7. PROGRESS.md 업데이트 원칙

작업 완료 즉시 PROGRESS.md를 업데이트한다.
다음 세션에서 중복 작업을 방지하여 토큰을 절약한다.

```markdown
# 나쁜 예: 나중에 한꺼번에 업데이트
# 좋은 예: 작업 완료 직후 즉시 ✅ 표시
```

---

## 8. 현재 적용 중인 최적화 설정

### Hook 체인 (`.claude/settings.json`)

```
PreToolUse(Edit|Write) → pre-edit.sh   : 금지 패턴 사전 차단
PreToolUse(Bash)       → pre-bash.sh   : 위험 명령 차단
PostToolUse(Edit|Write) → post-edit.sh : 컴파일 자동 검증
Stop                   → stop-check.sh : 테스트 + PROGRESS.md 확인
```

### 모델 기본값

- `.claude/settings.json`의 `"model": "claude-sonnet-4-6"` 이 기본값
- 단순 작업 요청 시 프롬프트에 `[haiku]` 접두어로 모델 전환 유도 가능
- 복잡한 설계 시 프롬프트에 `[opus]` 접두어 사용
