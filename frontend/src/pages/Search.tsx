import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

interface PostSummary {
  id: number; title: string; category: string; viewCount: number; tags: string[]; createdAt: string; authorUsername: string
}

export default function Search() {
  const [keyword, setKeyword] = useState('')
  const [submitted, setSubmitted] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['search', submitted],
    queryFn: async () => {
      const res = await api.get<{ data: { content: PostSummary[] } }>(`/posts/search?keyword=${encodeURIComponent(submitted)}`)
      return res.data.data.content
    },
    enabled: submitted.length > 0,
  })

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'calc(var(--section-spacing) / 2) var(--padding-desktop)' }}>
      <p className="label" style={{ marginBottom: 8 }}>Search</p>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--fg)', marginBottom: 40, borderBottom: '1px solid var(--divider)', paddingBottom: 24 }}>
        검색
      </h1>

      <form onSubmit={e => { e.preventDefault(); setSubmitted(keyword) }} style={{ display: 'flex', gap: 0, marginBottom: 48, borderBottom: '1px solid var(--divider)' }}>
        <input
          className="input"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ flex: 1, border: 'none', borderBottom: 'none', fontSize: 16, padding: '12px 0' }}
        />
        <button type="submit" className="btn" style={{ alignSelf: 'center' }}>검색</button>
      </form>

      {submitted && <p className="label" style={{ marginBottom: 24 }}>"{submitted}" — {data?.length ?? 0}건</p>}
      {isLoading && <div style={{ textAlign: 'center', padding: '40px 0' }}><span className="label">Loading...</span></div>}

      {data && data.length > 0 && (
        <div style={{ borderTop: '1px solid var(--divider)' }}>
          {data.map(post => (
            <Link
              key={post.id}
              to={`/${post.authorUsername}/blog/${post.id}`}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--divider)', textDecoration: 'none' }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--fg)' }}>{post.title}</span>
              <div style={{ display: 'flex', gap: 24 }}>
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
