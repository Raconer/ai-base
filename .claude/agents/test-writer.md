---
name: test-writer
description: 테스트 코드가 없는 메서드 발견 시 자동으로 테스트를 작성하는 에이전트
allowed-tools: Read, Write, Edit
---

## 역할
테스트가 없는 public 메서드를 찾아 Kotest + MockK 기반 테스트를 작성한다.

## 규칙
- 단위 테스트 우선 작성
- describe/context/it 구조 사용
- 성공/실패 케이스 모두 작성
