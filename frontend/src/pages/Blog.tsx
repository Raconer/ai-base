import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

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
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-1">Blog</p>
          <h1 className="text-2xl font-bold text-white">전체 글</h1>
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(0) }}
          className="px-3 py-2 bg-[#1a1f2e] border border-[#2a3042] text-[#a8b2c8] text-sm rounded-xl outline-none focus:border-[#4f8ef7] transition-colors"
        >
          <option value="">전체 카테고리</option>
          <option value="dev">개발</option>
          <option value="ai">AI</option>
          <option value="etc">기타</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {data?.content.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="block">
                <div className="bg-[#1a1f2e] rounded-xl p-5 hover:bg-[#252b3b] transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-base font-semibold text-white hover:text-[#4f8ef7] transition-colors">
                      {post.title}
                    </h2>
                    <span className="text-xs text-[#6b7590] shrink-0">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.category && (
                      <span className="px-2.5 py-0.5 bg-[#4f8ef7]/10 text-[#4f8ef7] text-xs rounded-full font-medium">
                        {post.category}
                      </span>
                    )}
                    <span className="text-xs text-[#6b7590]">👁 {post.viewCount}</span>
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs text-[#6b7590]">#{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-[#1a1f2e] border border-[#2a3042] text-[#a8b2c8] rounded-xl text-sm disabled:opacity-40 hover:bg-[#252b3b] transition-colors"
              >
                이전
              </button>
              <span className="px-4 py-2 text-sm text-[#6b7590]">
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.hasNext}
                className="px-4 py-2 bg-[#1a1f2e] border border-[#2a3042] text-[#a8b2c8] rounded-xl text-sm disabled:opacity-40 hover:bg-[#252b3b] transition-colors"
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
