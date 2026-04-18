import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

interface PostSummary {
  id: number
  title: string
  status: string
  viewCount: number
  createdAt: string
}

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  if (!isAuthenticated()) return <Navigate to="/login" />

  const { data: posts } = useQuery({
    queryKey: ['my-posts'],
    queryFn: async () => {
      const res = await api.get<{ data: { content: PostSummary[] } }>('/posts/my?size=10')
      return res.data.data.content
    },
  })

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'calc(var(--section-spacing) / 2) var(--padding-desktop)' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, borderBottom: '1px solid var(--divider)', paddingBottom: 24 }}>
        <div>
          <p className="label" style={{ marginBottom: 8 }}>Dashboard</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--fg)' }}>
            {user?.name}
          </h1>
        </div>
        <button className="btn" onClick={() => navigate(`/${user?.username}/blog/new`)}>
          + 새 글 쓰기
        </button>
      </div>

      {/* 빠른 링크 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginBottom: 48 }}>
        {[
          { label: '내 포트폴리오', to: `/${user?.username}` },
          { label: '이력서', to: `/${user?.username}/resume` },
          { label: '검색', to: '/search' },
          { label: 'Swagger', href: 'http://localhost:8086/swagger-ui/index.html' },
        ].map((item, i) =>
          item.href ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', padding: '20px 24px',
                borderTop: '1px solid var(--divider)',
                borderLeft: i > 0 ? '1px solid var(--divider)' : undefined,
                textDecoration: 'none',
              }}
            >
              <span className="label">{item.label}</span>
            </a>
          ) : (
            <Link
              key={item.label}
              to={item.to!}
              style={{
                display: 'block', padding: '20px 24px',
                borderTop: '1px solid var(--divider)',
                borderLeft: i > 0 ? '1px solid var(--divider)' : undefined,
                textDecoration: 'none',
              }}
            >
              <span className="label">{item.label}</span>
            </Link>
          )
        )}
      </div>

      {/* 게시글 목록 */}
      <p className="label" style={{ marginBottom: 16 }}>최근 게시글</p>

      {posts && posts.length > 0 ? (
        <div style={{ borderTop: '1px solid var(--divider)' }}>
          {posts.map(post => (
            <div
              key={post.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 0',
                borderBottom: '1px solid var(--divider)',
              }}
            >
              <Link
                to={`/${user?.username}/blog/${post.id}`}
                style={{ color: 'var(--fg)', textDecoration: 'none', fontSize: 14, fontWeight: 500, flex: 1, marginRight: 24 }}
              >
                {post.title}
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <span className="label">{post.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span>
                <span className="label">{post.viewCount} views</span>
                <Link to={`/${user?.username}/blog/${post.id}/edit`} style={{ color: 'var(--fg-muted)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  수정
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '60px 0', textAlign: 'center', borderTop: '1px solid var(--divider)' }}>
          <p className="label" style={{ marginBottom: 24 }}>작성된 게시글 없음</p>
          <button className="btn" onClick={() => navigate(`/${user?.username}/blog/new`)}>
            첫 글 작성하기
          </button>
        </div>
      )}
    </div>
  )
}
