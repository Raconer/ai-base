import { Link } from 'react-router-dom'

const aiFeatures = [
  { icon: '🤖', title: 'LLM API', desc: '글 AI 교정 · 이력서 요약 · 오타 수정', color: 'text-[#4f8ef7]' },
  { icon: '🔍', title: 'Vector Search', desc: 'pgvector 기반 시맨틱 검색 + RAG', color: 'text-cyan-400' },
  { icon: '💬', title: 'Sentiment Analysis', desc: 'Claude API 감성분석 스코어링', color: 'text-violet-400' },
  { icon: '📄', title: 'PDF Pipeline', desc: 'PDF → 텍스트 추출 → 청킹 → DB', color: 'text-orange-400' },
  { icon: '📈', title: 'Ensemble Prediction', desc: '콘텐츠 추천 · 인기글 예측', color: 'text-emerald-400' },
  { icon: '🔄', title: 'Adaptive Feedback', desc: '작성 → AI 평가 → 수정 → 재평가', color: 'text-pink-400' },
  { icon: '🧠', title: 'Multi-Agent', desc: '자동 분류 · 태그 생성 파이프라인', color: 'text-[#4f8ef7]' },
  { icon: '📊', title: 'TimeSeries', desc: '방문자 통계 + 트렌드 예측', color: 'text-orange-400' },
]

const techStack = [
  {
    label: 'Backend',
    items: ['Spring Boot 3.4 + Java 21', 'JPA + QueryDSL', 'Spring Security + JWT'],
  },
  {
    label: 'Frontend',
    items: ['React 19 + Vite + TypeScript', 'TailwindCSS 4', 'Zustand + React Query'],
  },
  {
    label: 'Database',
    items: ['PostgreSQL 16 + pgvector', 'Redis 7', 'Docker Compose'],
  },
]

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

      {/* 히어로 */}
      <section className="py-8">
        <p className="text-xs font-medium text-[#6b7590] uppercase tracking-widest mb-4">Portfolio</p>
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          풀스택 AI 포트폴리오 레퍼런스
        </h1>
        <p className="text-base text-[#a8b2c8] max-w-xl mb-8 leading-relaxed">
          5개 실전 프로젝트의 AI 기술을 하나의 풀스택 앱에 통합한 레퍼런스 저장소
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/blog"
            className="px-6 py-2.5 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-xl font-semibold text-sm transition-colors"
          >
            블로그 보기
          </Link>
          <a
            href="https://github.com/Raconer/ai-base"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-[#1a1f2e] hover:bg-[#252b3b] border border-[#2a3042] text-[#a8b2c8] rounded-xl font-semibold text-sm transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* AI 기술 목록 */}
      <section>
        <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-5">AI 기술 목록</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {aiFeatures.map((f) => (
            <div key={f.title} className="bg-[#1a1f2e] rounded-2xl p-5 hover:bg-[#252b3b] transition-colors">
              <div className={`text-2xl mb-3 ${f.color}`}>{f.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-[#a8b2c8] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 기술 스택 */}
      <section>
        <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-5">기술 스택</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {techStack.map((s) => (
            <div key={s.label} className="bg-[#1a1f2e] rounded-2xl p-5">
              <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-3">{s.label}</p>
              <ul className="space-y-2">
                {s.items.map((item) => (
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

    </div>
  )
}
