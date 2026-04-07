import Card from '../components/ui/Card'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About</h1>
        <Card>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            AI Base는 5개의 실전 프로젝트(etf-platform, lotto, novel_studio, stock_traders, history)에서
            사용된 AI 기술들을 하나의 풀스택 포트폴리오 앱에 통합한 레퍼런스 저장소입니다.
          </p>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">출처 프로젝트</h2>
        <div className="space-y-3">
          {[
            { name: 'etf-platform', tech: 'MPT 포트폴리오 최적화, Sharpe Ratio, 리스크 스코어링', stack: 'FastAPI + Next.js + MySQL' },
            { name: 'lotto', tech: 'Bayesian, Poisson, Markov Chain, 앙상블 투표', stack: 'FastAPI + React + PostgreSQL' },
            { name: 'novel_studio', tech: 'Gemini LLM, 12단계 생성 파이프라인, 적응형 피드백', stack: 'FastAPI + Next.js + MySQL' },
            { name: 'stock_traders', tech: 'Claude API 감성분석, pgvector 벡터검색, TimescaleDB', stack: 'FastAPI + Next.js + PostgreSQL' },
            { name: 'history', tech: '(AI 없음 - 구조 참고)', stack: 'Spring Boot + React + PostgreSQL' },
          ].map((p) => (
            <Card key={p.name}>
              <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{p.tech}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{p.stack}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">GitHub</h2>
        <Card>
          <a
            href="https://github.com/Raconer/ai-base"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            github.com/Raconer/ai-base
          </a>
        </Card>
      </section>
    </div>
  )
}
