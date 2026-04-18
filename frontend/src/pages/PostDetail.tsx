import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

interface Post {
  id: number; title: string; content: string; status: string; category: string; viewCount: number; tags: string[]; authorUsername: string; createdAt: string; updatedAt: string
}

export default function PostDetail() {
  const { username, id } = useParams<{ username: string; id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isOwner = user?.username === username

  const { data: post, isLoading, isError } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => api.get(`/posts/${id}`).then(r => r.data.data),
  })

  if (isLoading) return <div style={{ padding: 'var(--section-spacing) var(--padding-desktop)', textAlign: 'center' }}><span className="label">Loading...</span></div>
  if (isError || !post) return <div style={{ padding: 'var(--section-spacing) var(--padding-desktop)', textAlign: 'center' }}><p className="label">게시글을 찾을 수 없음</p></div>

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 'calc(var(--section-spacing) / 2) var(--padding-desktop)' }}>
      <div style={{ marginBottom: 16 }}>
        <Link to={`/${username}/blog`} style={{ color: 'var(--fg-muted)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none' }}>
          ← @{username} / blog
        </Link>
      </div>

      <div style={{ borderBottom: '1px solid var(--divider)', paddingBottom: 32, marginBottom: 48 }}>
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {post.category && <span className="label">{post.category}</span>}
          <span className="label">{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
          <span className="label">{post.viewCount} views</span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--fg)', lineHeight: 1, marginBottom: 16 }}>
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 16 }}>
            {post.tags.map(tag => <span key={tag} className="label">#{tag}</span>)}
          </div>
        )}
      </div>

      <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--fg)', whiteSpace: 'pre-wrap' }}>
        {post.content}
      </div>

      {isOwner && (
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--divider)', display: 'flex', gap: 16 }}>
          <button className="btn" onClick={() => navigate(`/${username}/blog/${id}/edit`)}>수정</button>
        </div>
      )}
    </div>
  )
}
