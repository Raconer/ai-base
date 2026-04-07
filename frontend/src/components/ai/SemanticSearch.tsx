import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'

interface SemanticSearchResult {
  documentId: number
  filename: string
  chunkIndex: number
  chunkText: string
  similarity: number
  resumeId: number | null
  postId: number | null
  type: 'resume' | 'post'
}

export default function SemanticSearch() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'all' | 'resume' | 'post'>('all')

  const searchMutation = useMutation({
    mutationFn: () =>
      api.post<{ data: SemanticSearchResult[] }>('/ai/vector/search', {
        query,
        topK: 5,
        type: type === 'all' ? null : type,
      }),
  })

  const results = searchMutation.data?.data.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="의미 기반으로 검색하세요 (예: 백엔드 개발 경험, AI 프로젝트)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') searchMutation.mutate() }}
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'all' | 'resume' | 'post')}
          className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="all">전체</option>
          <option value="resume">이력서</option>
          <option value="post">게시글</option>
        </select>
        <Button
          onClick={() => searchMutation.mutate()}
          loading={searchMutation.isPending}
          disabled={!query.trim()}
        >
          검색
        </Button>
      </div>

      {searchMutation.isError && (
        <p className="text-sm text-red-500">검색 중 오류가 발생했습니다.</p>
      )}

      {searchMutation.isSuccess && results.length === 0 && (
        <p className="text-center py-8 text-gray-400">관련 내용을 찾지 못했습니다.</p>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            시맨틱 검색 결과 {results.length}건
          </p>
          {results.map((result) => (
            <Card key={result.documentId} padding={false} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      result.type === 'resume'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    }`}>
                      {result.type === 'resume' ? '이력서' : '게시글'}
                    </span>
                    <span className="text-xs text-gray-400">{result.filename}</span>
                    {result.postId && (
                      <Link
                        to={`/blog/${result.postId}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        게시글 보기 →
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {result.chunkText}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {(result.similarity * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-400">유사도</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
