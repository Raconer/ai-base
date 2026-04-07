import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '../../lib/api'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

interface LlmResponse {
  result: string
  model: string
  inputTokens: number
  outputTokens: number
}

interface AiWriterProps {
  text: string
  onApply: (correctedText: string) => void
}

type Tone = 'formal' | 'casual' | 'technical' | 'natural'

const toneLabels: Record<Tone, string> = {
  formal: '격식체',
  casual: '구어체',
  technical: '기술적',
  natural: '원문 유지',
}

export default function AiWriter({ text, onApply }: AiWriterProps) {
  const [open, setOpen] = useState(false)
  const [tone, setTone] = useState<Tone>('natural')
  const [result, setResult] = useState<LlmResponse | null>(null)

  const correctMutation = useMutation({
    mutationFn: () =>
      api.post<{ data: LlmResponse }>('/ai/llm/correct', { text, tone }),
    onSuccess: (res) => setResult(res.data.data),
  })

  const handleOpen = () => {
    setResult(null)
    setOpen(true)
  }

  const handleApply = () => {
    if (result) {
      onApply(result.result)
      setOpen(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleOpen}
        disabled={!text.trim()}
      >
        ✨ AI 교정
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="AI 글 교정">
        <div className="space-y-4">
          {/* 톤 선택 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              문체 톤
            </label>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(toneLabels) as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded text-sm border transition ${
                    tone === t
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                  }`}
                >
                  {toneLabels[t]}
                </button>
              ))}
            </div>
          </div>

          {/* 원문 미리보기 */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">원문</p>
            <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
              {text.slice(0, 300)}{text.length > 300 ? '...' : ''}
            </div>
          </div>

          {/* 교정 결과 */}
          {result && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">교정 결과</p>
                <span className="text-xs text-gray-400">
                  {result.inputTokens + result.outputTokens} 토큰 사용
                </span>
              </div>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-3 text-sm text-gray-800 dark:text-gray-200 max-h-48 overflow-y-auto whitespace-pre-wrap">
                {result.result}
              </div>
            </div>
          )}

          {/* 에러 */}
          {correctMutation.isError && (
            <p className="text-sm text-red-500">
              AI 교정에 실패했습니다. API 키를 확인해주세요.
            </p>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              취소
            </Button>
            {!result ? (
              <Button
                onClick={() => correctMutation.mutate()}
                loading={correctMutation.isPending}
                disabled={!text.trim()}
              >
                교정 시작
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => { setResult(null); correctMutation.reset() }}
                >
                  다시 교정
                </Button>
                <Button onClick={handleApply}>
                  적용
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
