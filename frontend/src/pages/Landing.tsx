import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const FEATURES = [
  {
    badge: 'Claude AI',
    title: 'AI 글 교정 & 분류',
    desc: '작성한 글을 AI가 자동으로 교정하고 카테고리·태그를 붙여줍니다.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    color: 'bg-[#4f8ef7]/20 text-[#4f8ef7]',
  },
  {
    badge: 'pgvector',
    title: 'PDF 이력서 관리',
    desc: 'PDF를 업로드하면 AI가 내용을 파악하고 검색 가능한 형태로 저장합니다.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    color: 'bg-violet-400/20 text-violet-400',
  },
  {
    badge: 'RAG',
    title: '시맨틱 검색',
    desc: '단순 키워드가 아닌 의미 기반으로 글과 이력서를 찾아줍니다.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
      </svg>
    ),
    color: 'bg-cyan-400/20 text-cyan-400',
  },
  {
    badge: 'TimeSeries',
    title: '방문자 트렌드 분석',
    desc: '포트폴리오 방문자 패턴을 시계열로 분석하고 예측합니다.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    color: 'bg-orange-400/20 text-orange-400',
  },
  {
    badge: 'Multi-Agent',
    title: '멀티 에이전트 파이프라인',
    desc: '여러 AI 에이전트가 협력해 글을 분석·분류·요약합니다.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    color: 'bg-pink-400/20 text-pink-400',
  },
  {
    badge: 'Feedback',
    title: '적응형 피드백 루프',
    desc: 'AI가 글을 평가하고 개선 제안을 반복해 품질을 높입니다.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    color: 'bg-emerald-400/20 text-emerald-400',
  },
]

const STEPS = [
  { num: '01', title: '회원가입', desc: 'username을 정하면 나만의 주소가 생깁니다.' },
  { num: '02', title: '글·이력서 작성', desc: '블로그 글을 쓰거나 PDF 이력서를 올리세요.' },
  { num: '03', title: 'AI가 처리', desc: 'AI가 자동으로 교정·분류·태그·요약합니다.' },
  { num: '04', title: '포트폴리오 공유', desc: 'URL 하나로 어디서든 공유하세요.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [usernameInput, setUsernameInput] = useState('')

  const handleClaim = () => {
    const q = usernameInput.trim() ? `?mode=register&u=${usernameInput.trim()}` : '?mode=register'
    navigate(`/login${q}`)
  }

  return (
    <div className="text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#1a1f2e] to-[#0f1117] -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4f8ef7] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-5xl mx-auto px-6 pt-24 pb-28">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            AI로 만드는<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#4f8ef7] to-indigo-400">
              개발자 포트폴리오
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#a8b2c8] mb-4 max-w-xl leading-relaxed">
            블로그·이력서·프로젝트를 한 곳에 모으고,<br className="hidden sm:block" />
            AI가 자동으로 분류·교정·요약해 드립니다.
          </p>

          {/* 기술 스택 뱃지 */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['Spring Boot 3', 'React 19', 'PostgreSQL + pgvector', 'Claude AI', 'RAG'].map(t => (
              <span key={t} className="px-3 py-1 bg-[#1a1f2e] border border-[#2a3042] text-[#a8b2c8] text-xs rounded-full font-medium">
                {t}
              </span>
            ))}
          </div>

          {isAuthenticated() && user ? (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate(`/${user.username}`)}
                className="px-7 py-3.5 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-xl font-semibold text-base transition-colors"
              >
                내 포트폴리오 보기 →
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-7 py-3.5 bg-[#1a1f2e] hover:bg-[#252b3b] border border-[#2a3042] text-[#a8b2c8] rounded-xl font-semibold text-base transition-colors"
              >
                대시보드
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
                <div className="flex flex-1 items-center bg-[#1a1f2e] border border-[#2a3042] rounded-xl overflow-hidden focus-within:border-[#4f8ef7] transition-colors">
                  <span className="pl-4 pr-1 text-[#6b7590] text-sm select-none whitespace-nowrap">portfolio.dev/</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && handleClaim()}
                    className="flex-1 py-3 pr-4 bg-transparent outline-none text-white placeholder-[#6b7590] text-sm"
                  />
                </div>
                <button
                  onClick={handleClaim}
                  className="px-5 py-3 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
                >
                  무료로 시작하기
                </button>
              </div>
              <p className="text-xs text-[#6b7590]">신용카드 불필요 · 영구 무료</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 기능 그리드 ── */}
      <section className="py-24 px-6 bg-[#1a1f2e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#6b7590] uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white">
              AI가 포트폴리오를{' '}
              <span className="text-[#4f8ef7]">대신 관리</span>해드려요
            </h2>
            <p className="text-[#a8b2c8]">글 하나 올리면 AI가 알아서 처리합니다</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="flex flex-col p-5 bg-[#252b3b] rounded-2xl hover:bg-[#2d3447] transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${f.color}`}>
                    {f.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#1a1f2e] text-[#6b7590] rounded-full">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-[#a8b2c8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#6b7590] uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white">시작하는 방법</h2>
            <p className="text-[#a8b2c8]">단 4단계, 5분이면 충분합니다</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative flex flex-col items-center text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-[#2a3042]" />
                )}
                <div className="relative z-10 w-14 h-14 mb-4 rounded-2xl bg-[#4f8ef7]/20 flex items-center justify-center">
                  <span className="text-xl font-black text-[#4f8ef7]">{s.num}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{s.title}</h3>
                <p className="text-xs text-[#a8b2c8] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 border-t border-[#2a3042]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative overflow-hidden bg-linear-to-br from-[#4f8ef7] to-indigo-600 rounded-3xl p-12">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">지금 바로 시작하세요</h2>
              <p className="text-blue-100 text-sm mb-8">나만의 URL로 포트폴리오를 세상에 공개하세요</p>
              {!isAuthenticated() ? (
                <button
                  onClick={() => navigate('/login?mode=register')}
                  className="px-7 py-3 bg-white text-[#4f8ef7] rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm"
                >
                  무료 계정 만들기 →
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/${user!.username}`)}
                  className="px-7 py-3 bg-white text-[#4f8ef7] rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm"
                >
                  내 포트폴리오 보러 가기 →
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
