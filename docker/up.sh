#!/bin/bash
# 전체 스택 Docker 빌드 + 실행
set -e

cd "$(dirname "$0")/.."

# .env 없으면 .env.example 복사 안내
if [ ! -f ".env" ]; then
  echo "⚠️  .env 파일이 없습니다."
  echo "   cp .env.example .env 후 ANTHROPIC_API_KEY를 채워주세요."
  echo "   API Key 없이도 기본 기능은 동작합니다."
  echo ""
fi

echo "🐳 전체 스택 빌드 + 실행 (최초 빌드 시 수 분 소요)"
docker compose -f docker/docker-compose.yml up --build -d

echo ""
echo "✅ 실행 완료!"
echo ""
echo "  Frontend: http://localhost:3007"
echo "  Backend:  http://localhost:8082"
echo "  Swagger:  http://localhost:8082/swagger-ui/index.html"
echo ""
echo "로그 확인: docker compose -f docker/docker-compose.yml logs -f"
echo "중지:      docker compose -f docker/docker-compose.yml down"
