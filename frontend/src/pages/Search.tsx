import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import SemanticSearch from '../components/ai/SemanticSearch'

interface PostSummary {
  id: number
  title: string
  category: string
  viewCount: number
  tags: string[]
  createdAt: string
}

export default function Search() {
  const [keyword, setKeyword] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [mode, setMode] = useState<'keyword' | 'semantic'>('keyword')
  const { isAuthenticated } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['search', submitted],
    queryFn: async () => {
      const res = await api.get<{ data: { content: PostSummary[] } }>(
        `/posts/search?keyword=${encodeURIComponent(submitted)}`
      )
      return res.data.data.content
    },
    enabled: submitted.length > 0,
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-1">Search</p>
          <h1 className="text-2xl font-bold text-white">검색</h1>
        </div>
        {isAuthenticated() && (
          <div className="flex gap-1 bg-[#1a1f2e] rounded-xl p-1">
            <button
              onClick={() => setMode('keyword')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === 'keyword'
                  ? 'bg-[#252b3b] text-white'
                  : 'text-[#6b7590] hover:text-[#a8b2c8]'
              }`}
            >
              키워드
            </button>
            <button
              onClick={() => setMode('semantic')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === 'semantic'
                  ? 'bg-[#252b3b] text-white'
                  : 'text-[#6b7590] hover:text-[#a8b2c8]'
              }`}
            >
              ✨ 시맨틱
            </button>
          </div>
        )}
      </div>

      {mode === 'semantic' ? (
        <SemanticSearch />
      ) : (
        <>
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(keyword) }}
            className="flex gap-2"
          >
            <input
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#1a1f2e] border border-[#2a3042] rounded-xl text-sm text-white placeholder-[#6b7590] outline-none focus:border-[#4f8ef7] focus:ring-1 focus:ring-[#4f8ef7]/30 transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-xl font-semibold text-sm transition-colors"
            >
              검색
            </button>
          </form>

          {submitted && (
            <p className="text-xs text-[#6b7590]">
              "{submitted}" 검색 결과 {data?.length ?? 0}건
            </p>
          )}

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="space-y-2">
            {data?.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="block">
                <div className="bg-[#1a1f2e] rounded-xl p-5 hover:bg-[#252b3b] transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-sm font-semibold text-white hover:text-[#4f8ef7] transition-colors">
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
