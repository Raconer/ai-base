#!/bin/bash
# 이번 대화에서 작성/수정된 Java 파일이 있는지 확인
# Stop hook은 stdin으로 대화 컨텍스트를 받지 않으므로
# 최근 변경된 프로덕션 Java 파일에 대응하는 테스트 파일 존재 여부를 확인한다

BACKEND_SRC="backend/src/main/java/com/aibase"
BACKEND_TEST="backend/src/test/java/com/aibase"

missing=()

# 최근 커밋(HEAD)에서 변경된 프로덕션 Java 파일 목록
changed=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | grep "src/main/java.*\.java$" || true)

for file in $changed; do
  # 파일명에서 클래스명 추출 (예: FeedbackController.java → FeedbackController)
  classname=$(basename "$file" .java)

  # 대응하는 테스트 파일 존재 여부 확인
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

exit 0
