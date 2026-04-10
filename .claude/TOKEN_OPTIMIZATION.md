# 토큰 절약 전략 가이드

> AI Base 프로젝트에서 Claude Code 사용 시 토큰을 효율적으로 사용하는 방법.

---

## 1. 모델 티어링

작업 복잡도에 따라 적절한 모델을 선택한다.

| 작업 유형 | 권장 모델 | 이유 |
|---------|---------|------|
| 단순 CRUD 생성, 타입 수정, 파일 이동 | `claude-haiku-4-5` | 빠르고 저렴 |
| 로직 구현, 리팩토링, 버그 수정 | `claude-sonnet-4-6` | 균형 |
| 아키텍처 설계, 복잡한 AI 알고리즘 | `claude-opus-4-6` | 최고 품질 |

```bash
# Claude Code에서 모델 지정
claude --model haiku   # 단순 작업
claude --model sonnet  # 일반 작업 (기본값)
claude --model opus    # 복잡한 설계
```

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
docs/PROGRESS.md 읽고 🔄 항목부터 이어서 진행해줘.
```

PROGRESS.md가 정확하면 수십 줄의 재설명이 불필요하다.

---

## 5. 컨텍스트 범위 제한

필요한 파일만 읽도록 요청을 구체적으로 작성한다.

```bash
# 나쁜 예: 전체 프로젝트 스캔
"프로젝트 전체를 분석해줘"

# 좋은 예: 특정 파일/폴더 지정
"backend/src/main/java/com/aibase/ai/llm/ 폴더만 읽고 분석해줘"
```

---

## 6. Hook을 통한 자동 가드레일

잘못된 코드를 **생성 후 수정**하지 않고 **생성 전에 차단**하여
재작업 토큰을 절약한다.

```
pre-edit.sh → @Autowired, lombok, System.out.println 차단
→ 수정 요청 없이 처음부터 올바른 코드 작성 유도
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

### `.claude/settings.json` Hook 설정

```json
{
  "hooks": {
    "UserPromptSubmit": [코드 작업 시 컨벤션 리마인더],
    "PreToolUse(Edit|Write)": [금지 패턴 차단 → 재작업 방지],
    "Stop": [PROGRESS.md 업데이트 확인 → 세션 복구 비용 절감]
  }
}
```

### 모델별 작업 분류 (이 프로젝트 기준)

| 작업 | 실제 사용 모델 |
|------|-------------|
| CRUD 엔티티/DTO 추가 | haiku |
| AI 알고리즘 (선형 회귀, 앙상블 등) | sonnet |
| 아키텍처 설계 (CLAUDE.md 계층 구조) | sonnet |
| 멀티 에이전트 파이프라인 설계 | opus |
