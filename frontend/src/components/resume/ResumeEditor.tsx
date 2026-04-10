import { useState } from 'react'
import Button from '../ui/Button'
import { useApi } from '../../hooks/useApi'
import { useNotificationStore } from '../../stores/notificationStore'

interface ResumeEditorProps {
  resumeId?: number
  initialTitle?: string
  initialSummary?: string
  onSaved?: () => void
}

export default function ResumeEditor({
  resumeId,
  initialTitle = '',
  initialSummary = '',
  onSaved,
}: ResumeEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [summary, setSummary] = useState(initialSummary)
  const { loading, request } = useApi()
  const notify = useNotificationStore()

  const handleSave = async () => {
    if (!title.trim()) {
      notify.error('제목을 입력해주세요.')
      return
    }

    const config = resumeId
      ? { method: 'PUT' as const, url: `/resumes/${resumeId}`, data: { title, summary } }
      : { method: 'POST' as const, url: '/resumes', data: { title, summary } }

    const result = await request(config)
    if (result) {
      notify.success(resumeId ? '이력서가 수정되었습니다.' : '이력서가 생성되었습니다.')
      onSaved?.()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          제목
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="이력서 제목"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          요약
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="이력서 요약 내용"
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={loading}>
          {resumeId ? '수정 저장' : '이력서 생성'}
        </Button>
      </div>
    </div>
  )
}
