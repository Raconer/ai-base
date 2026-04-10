#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# 명령어에서 첫 번째 실행 구문만 추출 (heredoc/문자열 인자 내부 텍스트 오탐 방지)
# git commit -m "..." 처럼 따옴표 안 내용은 무시하고 명령어 라인만 검사
FIRST_LINE=$(echo "$COMMAND" | head -1)
# 따옴표/heredoc 제거 후 실제 명령어 부분만
CMD_PART=$(echo "$FIRST_LINE" | sed "s/['\"].*['\"]//g" | sed 's/\$(.*//')

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
