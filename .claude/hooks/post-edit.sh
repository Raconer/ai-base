#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Java 파일이 수정된 경우에만 컴파일 검증
if echo "$FILE_PATH" | grep -q "\.java$"; then
  cd backend 2>/dev/null || exit 0
  ./gradlew compileJava --quiet 2>&1

  if [ $? -ne 0 ]; then
    echo "❌ 컴파일 실패 — 코드를 수정하라"
    exit 1
  fi
fi

exit 0
