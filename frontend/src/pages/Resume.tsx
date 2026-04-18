import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

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
      <div className="text-center py-20 text-[#6b7590]">
        이력서를 보려면 로그인이 필요합니다.
      </div>
    )
  }

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!primary) {
    return (
      <div className="text-center py-20 text-[#6b7590]">
        <div className="text-4xl mb-3">📄</div>
        <p>등록된 이력서가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-1">Resume</p>
          <h1 className="text-2xl font-bold text-white">{primary.title}</h1>
        </div>
        <span className="text-xs text-[#6b7590]">
          최종 수정: {new Date(primary.updatedAt).toLocaleDateString('ko-KR')}
        </span>
      </div>

      {primary.summary && (
        <div className="bg-[#1a1f2e] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-3">요약</p>
          <p className="text-sm text-[#a8b2c8] whitespace-pre-wrap leading-relaxed">{primary.summary}</p>
        </div>
      )}

      {primary.skills && Object.keys(primary.skills).length > 0 && (
        <div className="bg-[#1a1f2e] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-3">기술 스택</p>
          <pre className="text-sm text-[#a8b2c8] whitespace-pre-wrap font-mono">
            {JSON.stringify(primary.skills, null, 2)}
          </pre>
        </div>
      )}

      {primary.experience && Object.keys(primary.experience).length > 0 && (
        <div className="bg-[#1a1f2e] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-3">경력</p>
          <pre className="text-sm text-[#a8b2c8] whitespace-pre-wrap font-mono">
            {JSON.stringify(primary.experience, null, 2)}
          </pre>
        </div>
      )}

      {primary.education && Object.keys(primary.education).length > 0 && (
        <div className="bg-[#1a1f2e] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-3">학력</p>
          <pre className="text-sm text-[#a8b2c8] whitespace-pre-wrap font-mono">
            {JSON.stringify(primary.education, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
