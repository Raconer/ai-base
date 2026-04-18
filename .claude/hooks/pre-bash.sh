#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# 명령어에서 첫 번째 실행 구문만 추출 (heredoc/문자열 인자 내부 텍스트 오탐 방지)
# git commit -m "..." 처럼 따옴표 안 내용은 무시하고 명령어 라인만 검사
FIRST_LINE=$(echo "$COMMAND" | head -1)
# 따옴표/heredoc 제거 후 실제 명령어 부분만
CMD_PART=$(echo "$FIRST_LINE" | sed "s/['\"].*['\"]//g" | sed 's/\$(.*//')

# ── 브랜치 강제 규칙 ──────────────────────────────────────────────────────────
# git commit 시 main/master 직접 커밋 차단
# (merge 커밋, PROGRESS.md 단독 업데이트는 허용)
if echo "$CMD_PART" | grep -qE "^\s*git commit"; then
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    # PROGRESS.md / docs / CLAUDE.md / settings.json 만 수정한 경우는 허용
    STAGED=$(git diff --cached --name-only 2>/dev/null)
    ONLY_DOCS=$(echo "$STAGED" | grep -vE "^(docs/|\.claude/|CLAUDE\.md|README\.md)" | wc -l | tr -d ' ')
    if [ "$ONLY_DOCS" -gt 0 ]; then
      echo '{"decision":"block","reason":"main 브랜치 직접 커밋 금지. feature/* 브랜치를 먼저 생성하라: git checkout -b feature/<name>"}'
      exit 0
    fi
  fi
fi

# force push 차단 (--force-with-lease는 허용)
if echo "$CMD_PART" | grep -qE "git push --force[^-]|git push --force$|git push -f "; then
  echo '{"decision":"block","reason":"force push 금지. --force-with-lease 사용하라"}'
  exit 0
fi

# rm -rf 위험 경로 차단 — 실제 rm 명령어 행에만 적용
if echo "$CMD_PART" | grep -qE "^\s*rm\s+-rf?\s+(/|\.+/|src|backend|frontend)"; then
  echo '{"decision":"block","reason":"위험한 rm -rf 명령 차단. 대상 경로를 다시 확인하라"}'
  exit 0
fi

# git reset --hard 차단
if echo "$CMD_PART" | grep -qE "git reset --hard"; then
  echo '{"decision":"block","reason":"git reset --hard 차단. 사용자에게 확인 후 실행하라"}'
  exit 0
fi

# 프로덕션 DB 직접 drop 차단 (psql 직접 실행 시에만)
if echo "$CMD_PART" | grep -qiE "psql.*drop (table|database|schema)"; then
  echo '{"decision":"block","reason":"프로덕션 DB DROP 명령 차단. Flyway 마이그레이션 사용하라"}'
  exit 0
fi

exit 0
