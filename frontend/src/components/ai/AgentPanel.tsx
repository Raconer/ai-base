import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '../../lib/api'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface AgentStep {
  agentName: string
  input: string
  output: string
  durationMs: number
}

interface AgentResponse {
  category: string
  tags: string[]
  summary: string
  steps: AgentStep[]
}

interface AgentPanelProps {
  text: string
  onApply: (category: string, tags: string[]) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  tech: '기술',
  life: '일상',
  career: '커리어',
  review: '리뷰',
  tutorial: '튜토리얼',
  other: '기타',
}

const CATEGORY_COLORS: Record<string, string> = {
  tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  life: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  career: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  tutorial: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export default function AgentPanel({ text, onApply }: AgentPanelProps) {
  const [result, setResult] = useState<AgentResponse | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      api.post<{ data: AgentResponse }>('/ai/agent/classify', { text }),
    onSuccess: (res) => setResult(res.data.data),
  })

  if (!result) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          3단계 에이전트 파이프라인: 분류 → 태그 → 요약
        </p>
        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!text.trim()}
        >
          🤖 자동 분류 시작
        </Button>
        {mutation.isPending && (
          <div className="space-y-1">
            {['분류 에이전트', '태그 에이전트', '요약 에이전트'].map((name) => (
              <div key={name} className="flex items-center gap-2 text-sm text-gray-400">
                <span className="animate-pulse">⏳</span>
                <span>{name} 실행 중...</span>
              </div>
            ))}
          </div>
        )}
        {mutation.isError && (
          <p className="text-sm text-red-500">자동 분류에 실패했습니다.</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 분류 결과 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">카테고리:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[result.category] ?? CATEGORY_COLORS.other}`}>
          {CATEGORY_LABELS[result.category] ?? result.category}
        </span>
      </div>

      {/* 태그 */}
      <div>
        <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">추출된 태그:</span>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 요약 */}
      <Card>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">AI 요약</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{result.summary}</p>
      </Card>

      {/* 에이전트 단계 */}
      <details className="group">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
          에이전트 실행 상세 보기
        </summary>
        <div className="mt-2 space-y-2">
          {result.steps.map((step) => (
            <div key={step.agentName} className="bg-gray-50 dark:bg-gray-900 rounded p-2 text-xs">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{step.agentName}</span>
                <span className="text-gray-400">{step.durationMs}ms</span>
              </div>
              <div className="text-gray-500">→ {step.output}</div>
            </div>
          ))}
        </div>
      </details>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => { setResult(null); mutation.reset() }}>
          다시 실행
        </Button>
        <Button onClick={() => onApply(result.category, result.tags)}>
          분류 결과 적용
        </Button>
      </div>
    </div>
  )
}
