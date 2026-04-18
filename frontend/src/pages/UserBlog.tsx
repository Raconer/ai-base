import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

interface Post {
  id: number; title: string; status: string; category: string; viewCount: number; tags: string[]; createdAt: string
}

export default function UserBlog() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user: me } = useAuthStore()
  const isOwner = me?.username === username

  const { data, isLoading } = useQuery<{ content: Post[] }>({
    queryKey: ['user-posts', username],
    queryFn: () => api.get(`/posts?username=${username}`).then(r => r.data.data),
  })
  const posts = data?.content ?? []

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'calc(var(--section-spacing) / 2) var(--padding-desktop)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--divider)', paddingBottom: 24, marginBottom: 40 }}>
        <div>
          <Link to={`/${username}`} style={{ color: 'var(--fg-muted)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none' }}>
            ← @{username}
          </Link>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--fg)', marginTop: 8 }}>Blog</h1>
        </div>
        {isOwner && (
          <button className="btn" onClick={() => navigate(`/${username}/blog/new`)}>+ 새 글</button>
        )}
      </div>

      {isLoading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}><span className="label">Loading...</span></div>
      ) : posts.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}><p className="label">작성된 글 없음</p></div>
      ) : (
        <div style={{ borderTop: '1px solid var(--divider)' }}>
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/${username}/blog/${post.id}`}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--divider)', textDecoration: 'none' }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--fg)' }}>{post.title}</span>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                {post.category && <span className="label">{post.category}</span>}
                <span className="label">{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
