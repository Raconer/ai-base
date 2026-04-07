import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '../../lib/api'

interface SentimentResponse {
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  score: number
  positive: number
  negative: number
  neutral: number
  summary: string
}

interface SentimentBadgeProps {
  postId?: number
  text?: string
  score?: number | null  // 기존 저장된 점수
}

const labelConfig = {
  POSITIVE: { text: '긍정적', color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', icon: '😊' },
  NEGATIVE: { text: '부정적', color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300', icon: '😟' },
  NEUTRAL:  { text: '중립적', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400', icon: '😐' },
}

export default function SentimentBadge({ postId, text, score }: SentimentBadgeProps) {
  const [result, setResult] = useState<SentimentResponse | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const mutation = useMutation({
    mutationFn: () =>
      postId
        ? api.post<{ data: SentimentResponse }>(`/ai/sentiment/post/${postId}`)
        : api.post<{ data: SentimentResponse }>('/ai/sentiment/analyze', { text }),
    onSuccess: (res) => {
      setResult(res.data.data)
      setShowDetail(true)
    },
  })

  // 기존 저장 점수로 간단 표시
  if (score !== undefined && score !== null && !result) {
    const label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' =
      score >= 0.6 ? 'POSITIVE' : score <= 0.3 ? 'NEGATIVE' : 'NEUTRAL'
    const cfg = labelConfig[label]
    return (
      <button
        onClick={() => mutation.mutate()}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${cfg.color} hover:opacity-80 transition`}
        title="클릭하여 재분석"
      >
        {cfg.icon} {cfg.text} {(score * 100).toFixed(0)}%
      </button>
    )
  }

  if (result) {
    const cfg = labelConfig[result.label]
    return (
      <div className="inline-block">
        <button
          onClick={() => setShowDetail(!showDetail)}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${cfg.color}`}
        >
          {cfg.icon} {cfg.text} {(result.score * 100).toFixed(0)}%
        </button>
        {showDetail && (
          <div className="mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm text-xs space-y-1">
            <p className="text-gray-500 dark:text-gray-400 italic">"{result.summary}"</p>
            <div className="flex gap-3">
              <span className="text-green-600">😊 {(result.positive * 100).toFixed(0)}%</span>
              <span className="text-gray-500">😐 {(result.neutral * 100).toFixed(0)}%</span>
              <span className="text-red-600">😟 {(result.negative * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending || (!postId && !text)}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-40"
    >
      {mutation.isPending ? '분석 중...' : '🔍 감성 분석'}
    </button>
  )
}
