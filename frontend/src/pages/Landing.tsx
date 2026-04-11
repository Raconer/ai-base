import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const FEATURED_USERS = [
  {
    username: 'kimdongho',
    name: '김동호',
    role: '풀스택 개발자',
    bio: 'Spring Boot · React · AI 파이프라인',
    avatar: 'K',
    gradient: 'from-blue-500 to-indigo-600',
    posts: 12,
  },
  {
    username: 'dev_jane',
    name: 'Jane Choi',
    role: '프론트엔드 개발자',
    bio: 'React · TypeScript · 디자인 시스템',
    avatar: 'J',
    gradient: 'from-pink-500 to-rose-600',
    posts: 8,
  },
  {
    username: 'backend_lee',
    name: '이민준',
    role: '백엔드 엔지니어',
    bio: 'Java · Kubernetes · MSA 아키텍처',
    avatar: 'L',
    gradient: 'from-emerald-500 to-teal-600',
    posts: 15,
  },
]

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
    color: 'bg-blue-500',
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
    color: 'bg-violet-500',
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
    color: 'bg-cyan-500',
  },
  {
    badge: 'TimeSeries',
    title: '방문자 트렌드 분석',
    desc: '내 포트폴리오 방문자 패턴을 시계열로 분석하고 예측합니다.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    color: 'bg-orange-500',
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
    color: 'bg-pink-500',
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
    color: 'bg-green-500',
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
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* 배경 그래디언트 */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 -z-10" />
        {/* 블러 블롭 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl opacity-15 translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-5xl mx-auto px-6 pt-24 pb-28 text-center">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            AI 기반 개발자 포트폴리오 플랫폼
          </div>

          {/* 타이틀 */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            나만의{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
              AI 포트폴리오
            </span>
            <br />
            한 줄로 공유하세요
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
            블로그·이력서·프로젝트를 한 곳에 모으고,<br className="hidden sm:block" />
            AI가 자동으로 분류·교정·요약해 드립니다.
          </p>

          {/* CTA */}
          {isAuthenticated() && user ? (
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate(`/${user.username}`)}
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-base transition-colors shadow-lg shadow-blue-500/25"
              >
                내 포트폴리오 보기 →
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-7 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-base transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                대시보드
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
                <div className="flex flex-1 items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                  <span className="pl-4 pr-1 text-gray-400 text-sm select-none whitespace-nowrap">aibase.com/</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && handleClaim()}
                    className="flex-1 py-3 pr-4 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                  />
                </div>
                <button
                  onClick={handleClaim}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap shadow-lg shadow-blue-500/20"
                >
                  무료로 시작하기
                </button>
              </div>
              <p className="text-xs text-gray-400">신용카드 불필요 · 영구 무료</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 추천 포트폴리오 ── */}
      <section className="py-20 px-6 border-t border-gray-100 dark:border-gray-800/60">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-10">
            이런 포트폴리오를 만들 수 있어요
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURED_USERS.map(u => (
              <Link
                key={u.username}
                to={`/${u.username}`}
                className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg dark:hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-full bg-linear-to-br ${u.gradient} flex items-center justify-center text-white font-bold text-base shrink-0`}>
                    {u.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400">@{u.username}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">{u.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{u.bio}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-gray-400">글 {u.posts}편</span>
                  <span className="text-xs text-blue-500 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    방문하기 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 기능 그리드 ── */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              AI가 포트폴리오를{' '}
              <span className="text-blue-600">대신 관리</span>해드려요
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              글 하나 올리면 AI가 알아서 처리합니다
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="flex flex-col p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl ${f.color} flex items-center justify-center text-white`}>
                    {f.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">시작하는 방법</h2>
            <p className="text-gray-500 dark:text-gray-400">단 4단계, 5분이면 충분합니다</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative flex flex-col items-center text-center">
                {/* 연결선 */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-gray-200 dark:bg-gray-800" />
                )}
                <div className="relative z-10 w-14 h-14 mb-4 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-xl font-black text-white">{s.num}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">{s.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800/60">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-12">
            {/* 내부 블롭 */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">지금 바로 시작하세요</h2>
              <p className="text-blue-100 text-sm mb-8">나만의 URL로 포트폴리오를 세상에 공개하세요</p>
              {!isAuthenticated() ? (
                <button
                  onClick={() => navigate('/login?mode=register')}
                  className="px-7 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg text-sm"
                >
                  무료 계정 만들기 →
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/${user!.username}`)}
                  className="px-7 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg text-sm"
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
