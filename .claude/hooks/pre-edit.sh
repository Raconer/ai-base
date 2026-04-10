#!/bin/bash
INPUT=$(cat)
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# 마크다운/문서 파일은 Java 코드 검사 제외
IS_DOC=false
if echo "$FILE_PATH" | grep -qE "\.(md|txt|yml|yaml|json|sh)$"; then
  IS_DOC=true
fi

# 테스트 파일은 Spring 테스트 표준 주입 허용 (@WebMvcTest 등)
IS_TEST=false
if echo "$FILE_PATH" | grep -q "src/test"; then
  IS_TEST=true
fi

if [ "$IS_DOC" = "false" ]; then
  # 프로덕션 코드에서만 필드 주입 차단
  AUTOWIRED_ANNOTATION="@Autowired"
  if [ "$IS_TEST" = "false" ] && echo "$CONTENT" | grep -qF "$AUTOWIRED_ANNOTATION"; then
    echo '{"decision":"block","reason":"@Autowired 금지. 생성자 주입 사용하라"}'
    exit 0
  fi

  # lombok 감지 → 저장 차단
  if echo "$CONTENT" | grep -q "import lombok"; then
    echo '{"decision":"block","reason":"lombok 금지. Kotlin data class 사용하라"}'
    exit 0
  fi

  # System.out.println 감지 → 저장 차단
  if echo "$CONTENT" | grep -q "System.out.println"; then
    echo '{"decision":"block","reason":"System.out.println 금지. Logger 사용하라"}'
    exit 0
  fi
fi

# force push 차단 (--force-with-lease는 허용)
if echo "$COMMAND" | grep -qE "git push --force[^-]|git push --force$"; then
  echo '{"decision":"block","reason":"force push 금지. --force-with-lease 사용하라"}'
  exit 0
fi

exit 0
