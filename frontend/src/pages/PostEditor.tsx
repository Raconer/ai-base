import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import AiWriter from '../components/ai/AiWriter'

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

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEdit ? '게시글 수정' : '새 게시글'}
      </h1>
      <Card>
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">내용</label>
              <AiWriter text={content} onApply={(corrected) => setContent(corrected)} />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              required
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? '수정 완료' : '작성 완료'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
