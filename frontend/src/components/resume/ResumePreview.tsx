import Card from '../ui/Card'
import { formatDate } from '../../lib/utils'

interface ResumePreviewProps {
  title: string
  summary?: string
  updatedAt?: string
  isPrimary?: boolean
}

export default function ResumePreview({ title, summary, updatedAt, isPrimary }: ResumePreviewProps) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {isPrimary && (
          <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
            대표 이력서
          </span>
        )}
      </div>

      {summary && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">{summary}</p>
      )}

      {updatedAt && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          최종 수정: {formatDate(updatedAt)}
        </p>
      )}
    </Card>
  )
}
