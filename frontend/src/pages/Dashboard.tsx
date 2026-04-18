import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

interface PostSummary {
  id: number
  title: string
  status: string
  viewCount: number
  createdAt: string
}

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  if (!isAuthenticated()) return <Navigate to="/login" />

  const { data: posts } = useQuery({
    queryKey: ['my-posts'],
    queryFn: async () => {
      const res = await api.get<{ data: { content: PostSummary[] } }>('/posts/my?size=5')
      return res.data.data.content
    },
  })

  const QUICK_LINKS = [
    { icon: '✏️', label: '글 작성', to: '/blog/new' },
    { icon: '📄', label: '이력서', to: '/resume' },
    { icon: '🔍', label: '검색', to: '/search' },
    { icon: '🔧', label: 'Swagger', href: 'http://localhost:8080/swagger-ui/index.html' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-white">
            안녕하세요, {user?.name}님
          </h1>
        </div>
        <button
          onClick={() => navigate('/blog/new')}
          className="px-5 py-2.5 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-xl font-semibold text-sm transition-colors"
        >
          + 새 글 쓰기
        </button>
      </div>

      {/* 빠른 링크 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_LINKS.map(item =>
          item.href ? (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
              <div className="bg-[#1a1f2e] rounded-2xl p-5 hover:bg-[#252b3b] transition-colors cursor-pointer text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-[#a8b2c8]">{item.label}</p>
              </div>
            </a>
          ) : (
            <Link key={item.label} to={item.to!}>
              <div className="bg-[#1a1f2e] rounded-2xl p-5 hover:bg-[#252b3b] transition-colors cursor-pointer text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-[#a8b2c8]">{item.label}</p>
              </div>
            </Link>
          )
        )}
      </div>

      {/* 최근 게시글 */}
      <div className="bg-[#1a1f2e] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider">최근 게시글</p>
          <Link to={`/${user?.username}`} className="text-xs text-[#4f8ef7] hover:underline">
            전체 보기 →
          </Link>
        </div>

        {posts && posts.length > 0 ? (
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 bg-[#252b3b] rounded-xl hover:bg-[#2d3447] transition-colors"
              >
                <Link
                  to={`/blog/${post.id}`}
                  className="font-medium text-white hover:text-[#4f8ef7] truncate flex-1 mr-4 text-sm transition-colors"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 text-xs text-[#6b7590] shrink-0">
                  <span className={`px-2 py-0.5 rounded font-medium ${
                    post.status === 'PUBLISHED'
                      ? 'bg-emerald-400/10 text-emerald-400'
                      : 'bg-[#6b7590]/20 text-[#6b7590]'
                  }`}>
                    {post.status === 'PUBLISHED' ? '공개' : '초안'}
                  </span>
                  <span>👁 {post.viewCount}</span>
                  <Link
                    to={`/blog/${post.id}/edit`}
                    className="text-[#4f8ef7] hover:underline"
                  >
                    수정
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-[#2a3042] p-10 text-center">
            <div className="text-4xl mb-3">✍️</div>
            <p className="text-sm text-[#6b7590]">아직 작성한 게시글이 없습니다.</p>
            <button
              onClick={() => navigate('/blog/new')}
              className="mt-4 px-4 py-2 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              첫 글 작성하기
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
