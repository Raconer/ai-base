import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

interface PostResponse {
  id: number
  title: string
  content: string
  status: string
  category: string
  sentimentScore: number | null
  aiCorrected: boolean
  viewCount: number
  userId: number
  userName: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get<{ data: PostResponse }>(`/posts/${id}`)
      return res.data.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      navigate('/blog')
    },
  })

  if (isLoading) return <div className="text-center py-12 text-gray-400">로딩 중...</div>
  if (!post) return <div className="text-center py-12 text-gray-400">게시글을 찾을 수 없습니다.</div>

  const isOwner = user?.id === post.userId

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <Card>
        <header className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              {post.category && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  {post.category}
                </span>
              )}
              <span>👁 {post.viewCount}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => navigate(`/blog/${id}/edit`)}>
                  수정
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleteMutation.isPending}
                  onClick={() => {
                    if (confirm('삭제하시겠습니까?')) deleteMutation.mutate()
                  }}
                >
                  삭제
                </Button>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">by {post.userName}</p>
        </header>

        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-800 dark:text-gray-200">
          {post.content}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Card>
    </article>
  )
}
