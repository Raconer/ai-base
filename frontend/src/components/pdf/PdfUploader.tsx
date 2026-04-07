import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'

interface PdfUploadResponse {
  documentId: number
  filename: string
  chunkCount: number
  message: string
}

interface PdfUploaderProps {
  type: 'resume' | 'post'
  targetId: number
  onSuccess?: (result: PdfUploadResponse) => void
}

export default function PdfUploader({ type, targetId, onSuccess }: PdfUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return api.post<{ data: PdfUploadResponse }>(
        `/pdf/${type}/${targetId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['pdf-chunks', type, targetId] })
      onSuccess?.(res.data.data)
    },
  })

  const handleFile = (file: File) => {
    if (!file.type.includes('pdf')) {
      alert('PDF 파일만 업로드 가능합니다.')
      return
    }
    uploadMutation.mutate(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />

        {uploadMutation.isPending ? (
          <div className="space-y-2">
            <div className="text-2xl animate-bounce">📄</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">PDF 처리 중...</p>
          </div>
        ) : uploadMutation.isSuccess ? (
          <div className="space-y-2">
            <div className="text-2xl">✅</div>
            <p className="text-sm text-green-600 dark:text-green-400">
              {uploadMutation.data.data.data.chunkCount}개 청크로 처리 완료
            </p>
            <p className="text-xs text-gray-400">다른 파일을 드롭하거나 클릭하여 교체</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-3xl">📄</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              PDF를 드롭하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-gray-400">최대 10MB</p>
          </div>
        )}
      </div>

      {uploadMutation.isError && (
        <p className="mt-2 text-xs text-red-500">업로드에 실패했습니다. 다시 시도해주세요.</p>
      )}
    </div>
  )
}
