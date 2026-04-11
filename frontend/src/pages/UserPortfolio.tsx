import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

interface PublicProfile {
  username: string
  name: string
  bio: string | null
  avatarUrl: string | null
  recentPosts: {
    id: number
    title: string
    status: string
    category: string
    viewCount: number
    tags: string[]
    createdAt: string
  }[]
}

export default function UserPortfolio() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user: me } = useAuthStore()
  const isOwner = me?.username === username

  const { data, isLoading, isError } = useQuery<PublicProfile>({
    queryKey: ['profile', username],
    queryFn: () => api.get(`/users/${username}`).then(r => r.data.data),
  })

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // 본인인데 사용자가 없는 경우 (DB 오류 등) or 타인 검색 실패
  if (isError || !data) {
    if (isOwner) {
      // 본인이면 온보딩 유도
      return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            포트폴리오를 시작해보세요
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            아직 공개 프로필이 없습니다. 대시보드에서 글을 작성해보세요.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            대시보드로 이동
          </button>
        </div>
      )
    }
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">존재하지 않는 사용자입니다</h1>
        <p className="text-gray-500 mb-6">@{username} 를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          홈으로
        </button>
      </div>
    )
  }

  const hasNoPosts = data.recentPosts.length === 0

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* 프로필 헤더 */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
          {data.avatarUrl
            ? <img src={data.avatarUrl} alt={data.name} className="w-full h-full rounded-full object-cover" />
            : data.name.charAt(0).toUpperCase()
          }
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{data.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">@{data.username}</p>
          {data.bio && <p className="text-gray-600 dark:text-gray-300 mt-1">{data.bio}</p>}
        </div>
        {isOwner && (
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            편집
          </button>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mb-8">
        {[
          { label: '홈', path: `/${username}` },
          { label: '블로그', path: `/${username}/blog` },
          { label: '이력서', path: `/${username}/resume` },
        ].map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className="pb-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 본인이고 글이 없을 때 — 온보딩 카드 */}
      {isOwner && hasNoPosts && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center mb-8">
          <div className="text-5xl mb-4">✍️</div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            아직 작성된 글이 없어요
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            첫 번째 블로그 글을 작성하면 포트폴리오가 채워집니다
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate(`/${username}/blog/new`)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              첫 글 작성하기 →
            </button>
            <button
              onClick={() => navigate(`/${username}/resume`)}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              이력서 등록하기
            </button>
          </div>
        </div>
      )}

      {/* 타인이고 글이 없을 때 */}
      {!isOwner && hasNoPosts && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📝</div>
          <p>아직 작성된 글이 없습니다.</p>
        </div>
      )}

      {/* 최근 글 목록 */}
      {!hasNoPosts && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">최근 글</h2>
            <Link to={`/${username}/blog`} className="text-sm text-blue-600 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <ul className="space-y-3">
            {data.recentPosts.map(post => (
              <li key={post.id}>
                <Link
                  to={`/${username}/blog/${post.id}`}
                  className="block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
