---
name: api-design
description: Spring Boot REST API 엔드포인트 생성 시 사용
---

# API 설계 규칙

## URL 컨벤션
- 접두사: `/api/` (버전 없음 — 이 프로젝트는 버전 미분리)
- 복수형 명사: `/api/posts`, `/api/resumes`, `/api/users`
- 케밥케이스: `/api/vector-search`
- 중첩 리소스: `/api/posts/{id}/tags`

## 응답 형식 (ApiResponse<T>)
```json
{
  "success": true,
  "message": "처리 완료",
  "data": {}
}
```

### Controller 반환 패턴
```java
// 조회
return ResponseEntity.ok(ApiResponse.ok(data));
// 생성
return ResponseEntity.status(201).body(ApiResponse.ok("생성 완료", data));
// 삭제
return ResponseEntity.ok(ApiResponse.ok("삭제 완료"));
```

## 에러 처리
- `GlobalExceptionHandler`가 모든 예외를 처리
- Controller에서 try-catch 직접 사용 금지
- Business 예외: `BusinessException.notFound/badRequest/unauthorized/conflict(message)`

## 인증
- `@AuthenticationPrincipal JwtUserDetails userDetails` 로 userId 획득
- Public 엔드포인트: `GET /api/posts/**`, `POST /api/auth/**`
- 나머지 전부 JWT 필요

## 페이지네이션
```java
// Controller
@GetMapping
public ResponseEntity<?> list(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(ApiResponse.ok(service.getList(pageable)));
}

// Service → PageResponse.from(page) 반환
```
