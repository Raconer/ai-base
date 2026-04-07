import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import Card from '../components/ui/Card'

interface ResumeResponse {
  id: number
  title: string
  summary: string
  skills: Record<string, unknown>
  experience: Record<string, unknown>
  education: Record<string, unknown>
  pdfUrl: string | null
  isPrimary: boolean
  updatedAt: string
}

export default function Resume() {
  const { isAuthenticated } = useAuthStore()

  const { data: primary, isLoading } = useQuery({
    queryKey: ['resume', 'primary'],
    queryFn: async () => {
      const res = await api.get<{ data: ResumeResponse }>('/resumes/primary')
      return res.data.data
    },
    enabled: isAuthenticated(),
    retry: false,
  })

  if (!isAuthenticated()) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        이력서를 보려면 로그인이 필요합니다.
      </div>
    )
  }

  if (isLoading) return <div className="text-center py-12 text-gray-400">로딩 중...</div>

  if (!primary) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <p className="mb-4">등록된 이력서가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{primary.title}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          최종 수정: {new Date(primary.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {primary.summary && (
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">요약</h2>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{primary.summary}</p>
        </Card>
      )}

      {primary.skills && Object.keys(primary.skills).length > 0 && (
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">기술 스택</h2>
          <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {JSON.stringify(primary.skills, null, 2)}
          </pre>
        </Card>
      )}

      {primary.experience && Object.keys(primary.experience).length > 0 && (
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">경력</h2>
          <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {JSON.stringify(primary.experience, null, 2)}
          </pre>
        </Card>
      )}

      {primary.education && Object.keys(primary.education).length > 0 && (
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">학력</h2>
          <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {JSON.stringify(primary.education, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  )
}
