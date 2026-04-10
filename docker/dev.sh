#!/bin/bash
# 개발 환경: DB + Redis만 올리기 (BE/FE는 로컬에서 직접 실행)
set -e

cd "$(dirname "$0")"

echo "🐳 개발용 인프라 시작 (PostgreSQL:5435, Redis:6383)"
docker compose up -d postgres redis

echo ""
echo "✅ 준비 완료!"
echo ""
echo "다음 명령으로 BE/FE를 로컬에서 실행하세요:"
echo ""
echo "  # 백엔드 (터미널 1)"
echo "  cd backend && JAVA_HOME=\$(echo \$(/usr/libexec/java_home -v 21)) ./gradlew bootRun"
echo ""
echo "  # 프론트엔드 (터미널 2)"
echo "  cd frontend && npm run dev"
echo ""
echo "  Swagger UI: http://localhost:8080/swagger-ui/index.html"
echo "  FE Dev:     http://localhost:3000"
