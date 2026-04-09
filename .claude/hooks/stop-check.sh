#!/bin/bash
./gradlew test --quiet 2>&1

if [ $? -ne 0 ]; then
  echo "❌ 테스트 실패 — 완료 불가. 테스트를 통과시켜라"
  exit 2
fi

exit 0
