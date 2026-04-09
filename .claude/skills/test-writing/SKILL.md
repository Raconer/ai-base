---
name: test-writing
description: Kotest + MockK 테스트 코드 작성 시 사용
---

# 테스트 작성 규칙

## 구조
- 단위 테스트: MockK로 의존성 모킹
- 통합 테스트: @SpringBootTest + TestContainers
- 테스트명: "~할 때 ~해야 한다" 형식

## 예시 패턴
```kotlin
describe("UserService") {
  context("존재하는 유저 조회 시") {
    it("유저 정보를 반환해야 한다") { ... }
  }
}
```
