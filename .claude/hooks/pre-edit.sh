#!/bin/bash
INPUT=$(cat)
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# @Autowired 감지 → 저장 차단
if echo "$CONTENT" | grep -q "@Autowired"; then
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

# force push 차단
if echo "$COMMAND" | grep -q "git push --force"; then
  echo '{"decision":"block","reason":"force push 금지"}'
  exit 0
fi

exit 0
