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
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link to={`/${username}`} className="text-sm text-blue-600 hover:underline">
        ← @{username}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-6">이력서</h1>

      {isLoading && <div className="text-center py-12 text-gray-400">불러오는 중...</div>}

      {(isError || (!isLoading && !primary)) && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">📄</div>
          <p>공개된 이력서가 없습니다.</p>
        </div>
      )}

      {primary && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{primary.title}</h2>
            {primary.summary && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">{primary.summary}</p>
            )}
          </div>

          {Object.keys(primary.skills).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">기술 스택</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(primary.skills).map(([skill, level]) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {skill} {level && <span className="text-blue-400">· {level}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400">
            최종 수정: {new Date(primary.updatedAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
      )}
    </div>
  )
}
