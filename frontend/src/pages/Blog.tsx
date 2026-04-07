import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import Card from '../components/ui/Card'

interface PostSummary {
  id: number
  title: string
  status: string
  category: string
  viewCount: number
  tags: string[]
  createdAt: string
}

interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export default function Blog() {
  const [page, setPage] = useState(0)
  const [category, setCategory] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['posts', page, category],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), size: '10' })
      if (category) params.set('category', category)
      const res = await api.get<{ data: PageResponse<PostSummary> }>(`/posts?${params}`)
      return res.data.data
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog</h1>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(0) }}
          className="border rounded px-3 py-1 text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="">전체 카테고리</option>
          <option value="dev">개발</option>
          <option value="ai">AI</option>
          <option value="etc">기타</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.content.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <Link to={`/blog/${post.id}`} className="block">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 mb-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    {post.category && (
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                    )}
                    <span>👁 {post.viewCount}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </Card>
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                이전
              </button>
              <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.hasNext}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
