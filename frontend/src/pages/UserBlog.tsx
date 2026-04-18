import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

interface Post {
  id: number
  title: string
  status: string
  category: string
  viewCount: number
  tags: string[]
  createdAt: string
}

export default function UserBlog() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user: me } = useAuthStore()
  const isOwner = me?.username === username

  const { data, isLoading } = useQuery<{ content: Post[] }>({
    queryKey: ['user-posts', username],
    queryFn: () => api.get(`/posts?username=${username}`).then(r => r.data.data),
  })

  const posts = data?.content ?? []

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to={`/${username}`} className="text-xs text-[#4f8ef7] hover:underline">
            ← @{username}
          </Link>
          <h1 className="text-2xl font-bold text-white mt-1">블로그</h1>
        </div>
        {isOwner && (
          <button
            onClick={() => navigate(`/${username}/blog/new`)}
            className="px-4 py-2 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-xl text-sm font-semibold transition-colors"
          >
            + 새 글
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-[#6b7590]">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm">작성된 글이 없습니다.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {posts.map(post => (
            <li key={post.id}>
              <Link
                to={`/${username}/blog/${post.id}`}
                className="block p-5 bg-[#1a1f2e] rounded-xl hover:bg-[#252b3b] transition-colors"
              >
                <div className="flex justify-between gap-2 mb-2">
                  <h2 className="font-semibold text-white text-sm">{post.title}</h2>
                  <span className="text-xs text-[#6b7590] shrink-0">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {post.category && (
                    <span className="text-xs text-[#6b7590]">{post.category}</span>
                  )}
                  <span className="text-xs text-[#6b7590]">조회 {post.viewCount}</span>
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 bg-[#4f8ef7]/10 text-[#4f8ef7] text-xs rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
