import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

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
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">검색</h1>

      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(keyword) }}
        className="flex gap-3"
      >
        <div className="flex-1">
          <Input
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          검색
        </button>
      </form>

      {submitted && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          "{submitted}" 검색 결과 {data?.length ?? 0}건
        </p>
      )}

      {isLoading && <div className="text-center py-8 text-gray-400">검색 중...</div>}

      <div className="space-y-4">
        {data?.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <Link to={`/blog/${post.id}`} className="block">
              <h2 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 mb-1">
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
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
