---
name: api-design
description: Spring Boot REST API 엔드포인트 생성 시 사용
---

# API 설계 규칙

## URL 컨벤션
- 복수형 명사 사용: /users, /orders
- 버전 포함: /api/v1/users
- 케밥케이스: /user-profiles

## 응답 형식
```json
{
  "success": true,
  "data": {},
  "message": "처리 완료"
}
```

## 에러 처리
GlobalExceptionHandler에서 처리.
비즈니스 예외는 BusinessException(ErrorCode) 사용.
