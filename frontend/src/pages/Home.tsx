import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'

const aiFeatures = [
  { icon: '🤖', title: 'LLM API', desc: '글 AI 교정 · 이력서 요약 · 오타 수정' },
  { icon: '🔍', title: 'Vector Search', desc: 'pgvector 기반 시맨틱 검색 + RAG' },
  { icon: '💬', title: 'Sentiment Analysis', desc: 'Claude API 감성분석 스코어링' },
  { icon: '📄', title: 'PDF Pipeline', desc: 'PDF → 텍스트 추출 → 청킹 → DB' },
  { icon: '📈', title: 'Ensemble Prediction', desc: '콘텐츠 추천 · 인기글 예측' },
  { icon: '🔄', title: 'Adaptive Feedback', desc: '작성 → AI 평가 → 수정 → 재평가' },
  { icon: '🧠', title: 'Multi-Agent', desc: '자동 분류 · 태그 생성 파이프라인' },
  { icon: '📊', title: 'TimeSeries', desc: '방문자 통계 + 트렌드 예측' },
]

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">AI Base</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          5개 실전 프로젝트의 AI 기술을 하나의 풀스택 포트폴리오에 통합한 레퍼런스 저장소
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            블로그 보기
          </Link>
          <a
            href="https://github.com/Raconer/ai-base"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
          >
            GitHub
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI 기술 목록</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiFeatures.map((f) => (
            <Card key={f.title} className="hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">기술 스택</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Backend</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>Spring Boot 3.4 + Java 21</li>
              <li>JPA + QueryDSL</li>
              <li>Spring Security + JWT</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>React 19 + Vite + TypeScript</li>
              <li>TailwindCSS 4</li>
              <li>Zustand + React Query</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Database</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>PostgreSQL 16 + pgvector</li>
              <li>Redis 7</li>
              <li>Docker Compose</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}
