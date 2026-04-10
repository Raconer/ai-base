#!/bin/bash
# Stop hook: 완료 선언 전 PROGRESS.md 업데이트 확인
# 이번 세션에서 Java 파일을 수정했다면 대응 테스트가 있는지 체크

BACKEND_TEST="backend/src/test/java/com/aibase"

# 최근 커밋(HEAD)에서 변경된 프로덕션 Java 파일 목록 (config, common 제외)
changed=$(git diff --name-only HEAD~1 HEAD 2>/dev/null \
  | grep "src/main/java.*\.java$" \
  | grep -vE "(Config|Application|Base|Exception|Handler|Filter|Provider)\.java$" \
  || true)

missing=()

for file in $changed; do
  classname=$(basename "$file" .java)
  test_exists=$(find "$BACKEND_TEST" -name "${classname}Test.java" 2>/dev/null | head -1)
  if [ -z "$test_exists" ]; then
    missing+=("$classname")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "❌ 테스트 없는 클래스: ${missing[*]}"
  echo "테스트 코드를 작성한 후 완료하세요."
  exit 2
fi

# PROGRESS.md가 최근 1시간 내 수정되지 않았으면 경고
PROGRESS="docs/PROGRESS.md"
if [ -f "$PROGRESS" ]; then
  last_modified=$(find "$PROGRESS" -newer /tmp/.last_progress_check 2>/dev/null | wc -l)
  if [ "$last_modified" -eq 0 ]; then
    echo "⚠️  PROGRESS.md가 업데이트되지 않았습니다. 작업 완료 후 PROGRESS.md를 업데이트하세요."
    # 경고만 (exit 1 = Claude가 받아서 업데이트 유도)
    exit 1
  fi
fi

touch /tmp/.last_progress_check
exit 0
