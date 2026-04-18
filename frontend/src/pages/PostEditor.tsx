import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

export default function PostEditor() {
  const { username, id } = useParams<{ username: string; id?: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isEdit = !!id

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')

  const { data: existing } = useQuery({
    queryKey: ['post-edit', id],
    queryFn: () => api.get(`/posts/${id}`).then(r => r.data.data),
    enabled: isEdit,
  })

  useEffect(() => {
    if (existing) {
      setTitle(existing.title ?? '')
      setContent(existing.content ?? '')
      setCategory(existing.category ?? '')
      setTags((existing.tags ?? []).join(', '))
      setStatus(existing.status ?? 'DRAFT')
    }
  }, [existing])

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { title, content, category, tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean), status }
      return isEdit ? api.put(`/posts/${id}`, payload) : api.post('/posts', payload)
    },
    onSuccess: (res) => {
      const postId = res.data.data?.id ?? id
      navigate(`/${username}/blog/${postId}`)
    },
  })

  if (user?.username !== username) return (
    <div style={{ padding: 'var(--section-spacing) var(--padding-desktop)', textAlign: 'center' }}>
      <p className="label">권한 없음</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 'calc(var(--section-spacing) / 2) var(--padding-desktop)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--divider)', paddingBottom: 24, marginBottom: 40 }}>
        <p className="label">{isEdit ? '글 수정' : '새 글 쓰기'}</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
            style={{ background: 'transparent', border: '1px solid var(--divider)', color: 'var(--fg)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 12px', fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
          <button className="btn" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !title.trim()}>
            {saveMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <input
          className="input"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ fontSize: 20, fontWeight: 700, border: 'none', borderBottom: '1px solid var(--divider)', padding: '0 0 16px 0' }}
        />
        <div style={{ display: 'flex', gap: 16 }}>
          <input className="input" placeholder="카테고리" value={category} onChange={e => setCategory(e.target.value)} style={{ flex: 1 }} />
          <input className="input" placeholder="태그 (쉼표 구분)" value={tags} onChange={e => setTags(e.target.value)} style={{ flex: 2 }} />
        </div>
        <textarea
          className="input"
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{ minHeight: 480, resize: 'vertical', fontSize: 14, lineHeight: 1.8, fontFamily: 'var(--font-sans)' }}
        />
      </div>
    </div>
  )
}
