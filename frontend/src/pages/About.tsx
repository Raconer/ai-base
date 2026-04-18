const projects = [
  { name: 'etf-platform', tech: 'MPT 포트폴리오 최적화, Sharpe Ratio, 리스크 스코어링', stack: 'FastAPI + Next.js + MySQL' },
  { name: 'lotto', tech: 'Bayesian, Poisson, Markov Chain, 앙상블 투표', stack: 'FastAPI + React + PostgreSQL' },
  { name: 'novel_studio', tech: 'Gemini LLM, 12단계 생성 파이프라인, 적응형 피드백', stack: 'FastAPI + Next.js + MySQL' },
  { name: 'stock_traders', tech: 'Claude API 감성분석, pgvector 벡터검색, TimescaleDB', stack: 'FastAPI + Next.js + PostgreSQL' },
  { name: 'history', tech: '구조 참고 (AI 없음)', stack: 'Spring Boot + React + PostgreSQL' },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">

      {/* 프로필 */}
      <section className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#4f8ef7] to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          K
        </div>
        <div>
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-widest mb-1">About</p>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">김동호</h1>
          <p className="text-sm text-[#4f8ef7] font-semibold mb-3">Backend Developer · AI Engineer</p>
          <p className="text-sm text-[#a8b2c8] leading-relaxed">
            Spring Boot와 React를 기반으로 AI 파이프라인을 구축하는 백엔드 개발자입니다.<br />
            5개의 실전 프로젝트에서 사용된 AI 기술들을 하나의 풀스택 포트폴리오 앱에 통합한 레퍼런스 저장소를 운영하고 있습니다.
          </p>
        </div>
      </section>

      {/* 기술 스택 */}
      <section>
        <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-4">Skills</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Backend', items: ['Java · Spring Boot 3', 'JPA · QueryDSL', 'Spring Security · JWT'] },
            { label: 'Frontend', items: ['React 19 · TypeScript', 'TailwindCSS 4', 'Zustand · React Query'] },
            { label: 'AI / ML', items: ['Claude API · LLM', 'pgvector · RAG', 'TimescaleDB · 시계열'] },
            { label: 'Infra', items: ['PostgreSQL · Redis', 'Docker Compose', 'GitHub Actions'] },
          ].map(s => (
            <div key={s.label} className="bg-[#1a1f2e] rounded-xl p-4">
              <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-2">{s.label}</p>
              <ul className="space-y-1">
                {s.items.map(item => (
                  <li key={item} className="text-sm text-[#a8b2c8] flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#4f8ef7] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 출처 프로젝트 */}
      <section>
        <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-4">Projects</p>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.name} className="bg-[#1a1f2e] rounded-xl p-4 hover:bg-[#252b3b] transition-colors">
              <h3 className="font-semibold text-white text-sm mb-1">{p.name}</h3>
              <p className="text-xs text-[#4f8ef7] mb-0.5">{p.tech}</p>
              <p className="text-xs text-[#6b7590]">{p.stack}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GitHub */}
      <section>
        <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-4">Links</p>
        <div className="bg-[#1a1f2e] rounded-xl p-4">
          <a
            href="https://github.com/Raconer/ai-base"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#4f8ef7] hover:underline"
          >
            github.com/Raconer/ai-base →
          </a>
        </div>
      </section>

    </div>
  )
}
