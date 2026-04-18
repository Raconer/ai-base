import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

interface ResumeData {
  id: number
  title: string
  summary: string
  skills: Record<string, string>
  experience: Record<string, unknown>
  education: Record<string, unknown>
  isPrimary: boolean
  updatedAt: string
}

export default function UserResume() {
  const { username } = useParams<{ username: string }>()

  const { data, isLoading, isError } = useQuery<ResumeData[]>({
    queryKey: ['user-resume', username],
    queryFn: () => api.get('/resumes').then(r => r.data.data),
  })

  const primary = data?.find(r => r.isPrimary) ?? data?.[0]

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link to={`/${username}`} className="text-xs text-[#4f8ef7] hover:underline">
        ← @{username}
      </Link>
      <h1 className="text-2xl font-bold text-white mt-2 mb-6">이력서</h1>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {(isError || (!isLoading && !primary)) && (
        <div className="text-center py-16 text-[#6b7590]">
          <div className="text-4xl mb-3">📄</div>
          <p className="text-sm">공개된 이력서가 없습니다.</p>
        </div>
      )}

      {primary && (
        <div className="bg-[#1a1f2e] rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">{primary.title}</h2>
            {primary.summary && (
              <p className="text-sm text-[#a8b2c8] mt-2 leading-relaxed">{primary.summary}</p>
            )}
          </div>

          {Object.keys(primary.skills).length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-3">기술 스택</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(primary.skills).map(([skill, level]) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-[#4f8ef7]/10 text-[#4f8ef7] rounded-full text-xs font-medium"
                  >
                    {skill}{level && <span className="text-[#4f8ef7]/60"> · {level}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-[#6b7590] pt-2 border-t border-[#2a3042]">
            최종 수정: {new Date(primary.updatedAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
      )}
    </div>
  )
}
