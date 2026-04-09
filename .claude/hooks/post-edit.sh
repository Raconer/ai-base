#!/bin/bash
./gradlew compileKotlin --quiet 2>&1

if [ $? -ne 0 ]; then
  echo "❌ 컴파일 실패 — 코드를 수정하라"
  exit 1
fi

exit 0
