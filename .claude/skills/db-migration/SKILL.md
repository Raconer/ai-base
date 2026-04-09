---
name: db-migration
description: Flyway DB 마이그레이션 파일 작성 시 사용
---

# 마이그레이션 규칙

## 파일명 컨벤션
```
V{버전}__{설명}.sql
예: V1__create_users_table.sql
```

## 주의사항
- 한번 적용된 마이그레이션 파일은 절대 수정 금지
- 롤백 필요 시 새 파일로 작성
- DDL과 DML은 파일 분리
