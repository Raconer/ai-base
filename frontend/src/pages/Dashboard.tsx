import { useQuery } from '@tanstack/react-query'
import { Link, Navigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

interface PostSummary {
  id: number
  title: string
  status: string
  viewCount: number
  createdAt: string
}

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated()) return <Navigate to="/login" />

  const { data: posts } = useQuery({
    queryKey: ['my-posts'],
    queryFn: async () => {
      const res = await api.get<{ data: { content: PostSummary[] } }>('/posts/my?size=5')
      return res.data.data.content
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          안녕하세요, {user?.name}님
        </h1>
        <Button onClick={() => window.location.href = '/blog/new'}>새 글 쓰기</Button>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">최근 게시글</h2>
        {posts && posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} padding={false} className="p-4">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/blog/${post.id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 truncate flex-1 mr-4"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-gray-500 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      post.status === 'PUBLISHED'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {post.status === 'PUBLISHED' ? '공개' : '초안'}
                    </span>
                    <span>👁 {post.viewCount}</span>
                    <Link
                      to={`/blog/${post.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      수정
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center text-gray-500 dark:text-gray-400">
            아직 작성한 게시글이 없습니다.
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">빠른 링크</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/blog/new">
            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-2xl mb-2">✏️</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">글 작성</p>
            </Card>
          </Link>
          <Link to="/resume">
            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">이력서</p>
            </Card>
          </Link>
          <Link to="/search">
            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">검색</p>
            </Card>
          </Link>
          <a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noopener noreferrer">
            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-2xl mb-2">🔧</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Swagger</p>
            </Card>
          </a>
        </div>
      </section>
    </div>
  )
}
