import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '../../lib/api'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface FeedbackIteration {
  iteration: number
  score: number
  suggestions: string[]
  improvedText: string
}

interface FeedbackResponse {
  originalText: string
  improvedText: string
  iterations: FeedbackIteration[]
  finalScore: number
  converged: boolean
}

interface FeedbackPanelProps {
  text: string
  onApply: (improved: string) => void
}

export default function FeedbackPanel({ text, onApply }: FeedbackPanelProps) {
  const [maxIterations, setMaxIterations] = useState(3)
  const [result, setResult] = useState<FeedbackResponse | null>(null)
  const [selectedIteration, setSelectedIteration] = useState(0)

  const mutation = useMutation({
    mutationFn: () =>
      api.post<{ data: FeedbackResponse }>('/ai/feedback/run', { text, maxIterations }),
    onSuccess: (res) => {
      setResult(res.data.data)
      setSelectedIteration(res.data.data.iterations.length - 1)
    },
  })

  if (!result) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">최대 반복 횟수:</span>
          {[1, 2, 3, 5].map((n) => (
            <button
              key={n}
              onClick={() => setMaxIterations(n)}
              className={`px-2 py-0.5 rounded text-sm border ${
                maxIterations === n
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              }`}
            >
              {n}회
            </button>
          ))}
        </div>
        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!text.trim()}
        >
          🔄 피드백 루프 시작
        </Button>
        {mutation.isError && (
          <p className="text-sm text-red-500">피드백 루프 실행에 실패했습니다.</p>
        )}
      </div>
    )
  }

  const iter = result.iterations[selectedIteration]

  return (
    <div className="space-y-4">
      {/* 점수 진행 */}
      <div className="flex items-center gap-2">
        {result.iterations.map((it, idx) => (
          <button
            key={it.iteration}
            onClick={() => setSelectedIteration(idx)}
            className={`flex flex-col items-center px-3 py-1 rounded border transition ${
              selectedIteration === idx
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
          >
            <span className="text-xs text-gray-500">{it.iteration}회차</span>
            <span className={`text-sm font-bold ${
              it.score >= 80 ? 'text-green-600' : it.score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {it.score}점
            </span>
          </button>
        ))}
        {result.converged && (
          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
            ✅ 수렴
          </span>
        )}
      </div>

      {/* 선택된 회차 상세 */}
      <Card>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {iter.iteration}회차 개선 제안
        </h3>
        <ul className="space-y-1 mb-3">
          {iter.suggestions.map((s, i) => (
            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
              <span className="text-blue-500">→</span>{s}
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm text-gray-700 dark:text-gray-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
          {iter.improvedText}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => { setResult(null); mutation.reset() }}>
          다시 실행
        </Button>
        <Button onClick={() => onApply(result.improvedText)}>
          최종본 적용
        </Button>
      </div>
    </div>
  )
}
