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
      <div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (isError || !data) {
    if (isOwner) {
      return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-white mb-2">포트폴리오를 시작해보세요</h1>
          <p className="text-[#a8b2c8] mb-8">아직 공개 프로필이 없습니다. 대시보드에서 글을 작성해보세요.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#4f8ef7] text-white rounded-xl font-semibold hover:bg-[#3d7ef6] transition-colors"
          >
            대시보드로 이동
          </button>
        </div>
      )
    }
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-white mb-2">존재하지 않는 사용자입니다</h1>
        <p className="text-[#a8b2c8] mb-6">@{username} 를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-[#4f8ef7] text-white rounded-xl hover:bg-[#3d7ef6] transition-colors"
        >
          홈으로
        </button>
      </div>
    )
  }

  const hasNoPosts = data.recentPosts.length === 0

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">

      {/* 프로필 헤더 */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#4f8ef7] to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
          {data.avatarUrl
            ? <img src={data.avatarUrl} alt={data.name} className="w-full h-full rounded-full object-cover" />
            : data.name.charAt(0).toUpperCase()
          }
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{data.name}</h1>
          <p className="text-[#6b7590] text-sm">@{data.username}</p>
          {data.bio && <p className="text-[#a8b2c8] mt-1 text-sm">{data.bio}</p>}
        </div>
        {isOwner && (
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#1a1f2e] border border-[#2a3042] hover:bg-[#252b3b] text-[#a8b2c8] rounded-xl text-sm transition-colors"
          >
            편집
          </button>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 bg-[#1a1f2e] rounded-xl p-1 mb-8">
        {[
          { label: '홈', path: `/${username}` },
          { label: '블로그', path: `/${username}/blog` },
          { label: '이력서', path: `/${username}/resume` },
        ].map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors bg-[#252b3b] text-white"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 본인이고 글이 없을 때 — 온보딩 */}
      {isOwner && hasNoPosts && (
        <div className="rounded-2xl border-2 border-dashed border-[#2a3042] p-12 text-center mb-8">
          <div className="text-5xl mb-4">✍️</div>
          <h2 className="text-lg font-semibold text-white mb-2">아직 작성된 글이 없어요</h2>
          <p className="text-sm text-[#6b7590] mb-6">첫 번째 블로그 글을 작성하면 포트폴리오가 채워집니다</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate(`/${username}/blog/new`)}
              className="px-5 py-2.5 bg-[#4f8ef7] text-white rounded-xl text-sm font-semibold hover:bg-[#3d7ef6] transition-colors"
            >
              첫 글 작성하기 →
            </button>
            <button
              onClick={() => navigate(`/${username}/resume`)}
              className="px-5 py-2.5 bg-[#1a1f2e] border border-[#2a3042] text-[#a8b2c8] rounded-xl text-sm font-semibold hover:bg-[#252b3b] transition-colors"
            >
              이력서 등록하기
            </button>
          </div>
        </div>
      )}

      {/* 타인이고 글이 없을 때 */}
      {!isOwner && hasNoPosts && (
        <div className="text-center py-16 text-[#6b7590]">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm">아직 작성된 글이 없습니다.</p>
        </div>
      )}

      {/* 최근 글 목록 */}
      {!hasNoPosts && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider">최근 글</p>
            <Link to={`/${username}/blog`} className="text-xs text-[#4f8ef7] hover:underline">
              전체 보기 →
            </Link>
          </div>
          <ul className="space-y-2">
            {data.recentPosts.map(post => (
              <li key={post.id}>
                <Link
                  to={`/${username}/blog/${post.id}`}
                  className="block p-4 bg-[#1a1f2e] rounded-xl hover:bg-[#252b3b] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-white text-sm">{post.title}</h3>
                    <span className="text-xs text-[#6b7590] shrink-0">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 bg-[#4f8ef7]/10 text-[#4f8ef7] text-xs rounded-full font-medium">
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
