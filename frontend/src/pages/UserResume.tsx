import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

interface ResumeData {
  id: number; title: string; summary: string; skills: Record<string, string>; experience: Record<string, unknown>; education: Record<string, unknown>; isPrimary: boolean; updatedAt: string
}

export default function UserResume() {
  const { username } = useParams<{ username: string }>()
  const { data, isLoading, isError } = useQuery<ResumeData[]>({
    queryKey: ['user-resume', username],
    queryFn: () => api.get('/resumes').then(r => r.data.data),
  })
  const primary = data?.find(r => r.isPrimary) ?? data?.[0]

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'calc(var(--section-spacing) / 2) var(--padding-desktop)' }}>
      <Link to={`/${username}`} style={{ color: 'var(--fg-muted)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none' }}>
        ← @{username}
      </Link>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--fg)', marginTop: 8, marginBottom: 40, borderBottom: '1px solid var(--divider)', paddingBottom: 24 }}>Resume</h1>

      {isLoading && <span className="label">Loading...</span>}
      {(isError || (!isLoading && !primary)) && <p className="label">공개된 이력서 없음</p>}

      {primary && (
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', marginBottom: 16 }}>{primary.title}</h2>
          {primary.summary && <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 32 }}>{primary.summary}</p>}

          {Object.keys(primary.skills).length > 0 && (
            <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 24, marginBottom: 24 }}>
              <p className="label" style={{ marginBottom: 16 }}>Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                {Object.entries(primary.skills).map(([skill, level]) => (
                  <span key={skill} style={{ padding: '6px 16px 6px 0', fontSize: 13, color: 'var(--fg)', marginRight: 16, borderBottom: '1px solid var(--divider)' }}>
                    {skill}{level && <span style={{ color: 'var(--fg-muted)' }}> — {level}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="label" style={{ marginTop: 32 }}>최종 수정: {new Date(primary.updatedAt).toLocaleDateString('ko-KR')}</p>
        </div>
      )}
    </div>
  )
}
