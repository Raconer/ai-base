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
    queryFn: () => api.get('/api/posts').then(r => r.data.data),
  })

  const posts = data?.content ?? []

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to={`/${username}`} className="text-sm text-blue-600 hover:underline">
            ← @{username}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">블로그</h1>
        </div>
        {isOwner && (
          <button
            onClick={() => navigate(`/${username}/blog/new`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            + 새 글
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">📝</div>
          <p>작성된 글이 없습니다.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map(post => (
            <li key={post.id}>
              <Link
                to={`/${username}/blog/${post.id}`}
                className="block p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
              >
                <div className="flex justify-between gap-2">
                  <h2 className="font-semibold text-gray-900 dark:text-white">{post.title}</h2>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">{post.category}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">조회 {post.viewCount}</span>
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
      )}
    </div>
  )
}
