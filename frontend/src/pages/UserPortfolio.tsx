import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface PublicProfile {
  username: string
  name: string
  bio: string | null
  avatarUrl: string | null
  recentPosts: {
    id: number
    title: string
    status: string
    category: string
    viewCount: number
    tags: string[]
    createdAt: string
  }[]
}

export default function UserPortfolio() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user: me } = useAuthStore()
  const isOwner = me?.username === username
  const { ref, isVisible } = useScrollReveal<HTMLElement>()

  const { data, isLoading, isError } = useQuery<PublicProfile>({
    queryKey: ['profile', username],
    queryFn: () => api.get(`/users/${username}`).then(r => r.data.data),
  })

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
      <span className="label">Loading...</span>
    </div>
  )

  if (isError || !data) return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--section-spacing) var(--padding-desktop)', textAlign: 'center' }}>
      <p className="label" style={{ marginBottom: 24 }}>사용자를 찾을 수 없음</p>
      <p style={{ color: 'var(--fg-muted)', marginBottom: 32, fontSize: 14 }}>@{username}</p>
      <button className="btn" onClick={() => navigate('/')}>홈으로</button>
    </div>
  )

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'calc(var(--section-spacing) / 2) var(--padding-desktop)' }}>

      {/* 프로필 */}
      <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: 40, marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p className="label" style={{ marginBottom: 12 }}>@{data.username}</p>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--fg)', marginBottom: data.bio ? 12 : 0 }}>
            {data.name}
          </h1>
          {data.bio && <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6 }}>{data.bio}</p>}
        </div>
        {isOwner && (
          <button className="btn btn--ghost" onClick={() => navigate('/dashboard')}>편집</button>
        )}
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--divider)', marginBottom: 40 }}>
        {[
          { label: '홈', path: `/${username}` },
          { label: '블로그', path: `/${username}/blog` },
          { label: '이력서', path: `/${username}/resume` },
        ].map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            style={{
              fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
              textDecoration: 'none', color: 'var(--fg)', padding: '12px 24px 12px 0',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 온보딩 */}
      {isOwner && data.recentPosts.length === 0 && (
        <div style={{ padding: '60px 0', borderTop: '1px solid var(--divider)', textAlign: 'center' }}>
          <p className="label" style={{ marginBottom: 24 }}>아직 작성된 글이 없음</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button className="btn" onClick={() => navigate(`/${username}/blog/new`)}>첫 글 작성하기</button>
            <button className="btn btn--ghost" onClick={() => navigate(`/${username}/resume`)}>이력서 등록</button>
          </div>
        </div>
      )}

      {/* 글 목록 */}
      {data.recentPosts.length > 0 && (
        <section ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <p className="label">최근 글</p>
            <Link to={`/${username}/blog`} style={{ color: 'var(--fg-muted)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
              전체 보기
            </Link>
          </div>
          <div style={{ borderTop: '1px solid var(--divider)' }}>
            {data.recentPosts.map(post => (
              <Link
                key={post.id}
                to={`/${username}/blog/${post.id}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--divider)', textDecoration: 'none' }}
              >
                <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--fg)' }}>{post.title}</span>
                <span className="label">{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
