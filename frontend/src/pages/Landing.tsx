import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  const features = [
    { icon: '✍️', title: '블로그', desc: '글 작성 + AI 교정/분류/태그 자동화' },
    { icon: '📄', title: '이력서', desc: 'PDF 업로드 + AI 요약 + 버전 관리' },
    { icon: '🔍', title: '시맨틱 검색', desc: 'pgvector 기반 의미 검색' },
    { icon: '🤖', title: '멀티 에이전트', desc: '분류 → 태그 → 요약 자동 파이프라인' },
    { icon: '📊', title: '방문자 분석', desc: '시계열 기반 트렌드 예측' },
    { icon: '💬', title: '피드백 루프', desc: 'AI 평가 → 수정 제안 → 재평가 반복' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-4 text-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          AI Base
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
          AI가 붙은 개발자 포트폴리오 플랫폼
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-10">
          회원가입 후 <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-sm">/{'{username}'}</code> 주소로 나만의 포트폴리오를 공개하세요
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          {isAuthenticated() && user ? (
            <>
              <button
                onClick={() => navigate(`/${user.username}`)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                내 포트폴리오 보기
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                대시보드
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login?mode=register')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                무료로 시작하기
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                로그인
              </button>
            </>
          )}
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          제공하는 서비스
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-blue-600">
        <h2 className="text-2xl font-bold text-white mb-3">나만의 포트폴리오 URL을 만들어보세요</h2>
        <p className="text-blue-100 mb-6">aibase.com/kimdongho 처럼 내 이름으로 된 주소가 생깁니다</p>
        {!isAuthenticated() && (
          <button
            onClick={() => navigate('/login?mode=register')}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            지금 시작하기
          </button>
        )}
      </section>
    </div>
  )
}
