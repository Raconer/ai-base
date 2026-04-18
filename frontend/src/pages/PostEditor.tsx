import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import AiWriter from '../components/ai/AiWriter'
import Input from '../components/ui/Input'

export default function PostEditor() {
  const { username, id } = useParams<{ username: string; id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user: me } = useAuthStore()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState('DRAFT')

  const { data: existing } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get<{ data: { title: string; content: string; category: string; tags: string[]; status: string } }>(`/posts/${id}`)
      return res.data.data
    },
    enabled: isEdit,
  })

  useEffect(() => {
    if (existing) {
      setTitle(existing.title)
      setContent(existing.content)
      setCategory(existing.category ?? '')
      setTags(existing.tags.join(', '))
      setStatus(existing.status)
    }
  }, [existing])

  const mutation = useMutation({
    mutationFn: (body: object) =>
      isEdit ? api.put(`/posts/${id}`, body) : api.post('/posts', body),
    onSuccess: (res: { data: { data: { id: number } } }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      const owner = username ?? me?.username
      const postId = isEdit ? id : res.data.data.id
      navigate(`/${owner}/blog/${postId}`)
    },
  })

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate({
      title,
      content,
      category,
      status,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-1">
          {isEdit ? 'Edit Post' : 'New Post'}
        </p>
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? '게시글 수정' : '새 게시글'}
        </h1>
      </div>

      <div className="bg-[#1a1f2e] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="카테고리"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="dev, ai, etc"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b7590] uppercase tracking-wider">상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-3 bg-[#252b3b] border border-[#2a3042] rounded-xl text-sm text-white outline-none focus:border-[#4f8ef7] transition-colors"
              >
                <option value="DRAFT">초안</option>
                <option value="PUBLISHED">공개</option>
              </select>
            </div>
          </div>
          <Input
            label="태그 (쉼표로 구분)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="spring, java, ai"
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#6b7590] uppercase tracking-wider">내용</label>
              <AiWriter text={content} onApply={(corrected) => setContent(corrected)} />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              required
              className="w-full px-4 py-3 bg-[#252b3b] border border-[#2a3042] rounded-xl text-sm text-white placeholder-[#6b7590] outline-none focus:border-[#4f8ef7] focus:ring-1 focus:ring-[#4f8ef7]/30 transition-colors resize-y"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-[#252b3b] hover:bg-[#2d3447] text-[#a8b2c8] rounded-xl text-sm font-semibold transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2.5 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {mutation.isPending && (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isEdit ? '수정 완료' : '작성 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
