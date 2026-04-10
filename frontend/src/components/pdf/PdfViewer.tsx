import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApi } from '../../hooks/useApi'
import { truncate } from '../../lib/utils'

interface PdfChunk {
  id: number
  chunkIndex: number
  chunkText: string
  filename: string
}

interface PdfViewerProps {
  resumeId?: number
  postId?: number
}

export default function PdfViewer({ resumeId, postId }: PdfViewerProps) {
  const [chunks, setChunks] = useState<PdfChunk[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)
  const { loading, error, request } = useApi<PdfChunk[]>()

  const loadChunks = async () => {
    const url = resumeId
      ? `/pdf/resume/${resumeId}/chunks`
      : `/pdf/post/${postId}/chunks`
    const result = await request({ method: 'GET', url })
    if (result) setChunks(result)
  }

  if (!resumeId && !postId) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          PDF 청크 목록
        </h4>
        <Button size="sm" variant="secondary" onClick={loadChunks} loading={loading}>
          청크 불러오기
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {chunks.length > 0 && (
        <div className="space-y-2">
          {chunks.map((chunk) => (
            <Card key={chunk.id} padding={false} className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">청크 #{chunk.chunkIndex}</span>
                <button
                  className="text-xs text-blue-500 hover:underline"
                  onClick={() => setExpanded(expanded === chunk.id ? null : chunk.id)}
                >
                  {expanded === chunk.id ? '접기' : '펼치기'}
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {expanded === chunk.id ? chunk.chunkText : truncate(chunk.chunkText, 100)}
              </p>
            </Card>
          ))}
        </div>
      )}

      {chunks.length === 0 && !loading && (
        <p className="text-sm text-gray-400">청크를 불러오려면 버튼을 클릭하세요.</p>
      )}
    </div>
  )
}
