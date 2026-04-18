import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import SentimentBadge from '../components/ai/SentimentBadge'

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

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!post) return (
    <div className="text-center py-20 text-[#6b7590]">게시글을 찾을 수 없습니다.</div>
  )

  const isOwner = user?.id === post.userId

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-[#1a1f2e] rounded-2xl p-6">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {post.category && (
                <span className="px-2.5 py-0.5 bg-[#4f8ef7]/10 text-[#4f8ef7] text-xs rounded-full font-medium">
                  {post.category}
                </span>
              )}
              <span className="text-xs text-[#6b7590]">👁 {post.viewCount}</span>
              <span className="text-xs text-[#6b7590]">
                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
              </span>
              <SentimentBadge postId={post.id} score={post.sentimentScore} />
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/blog/${id}/edit`)}
                  className="px-3 py-1.5 bg-[#252b3b] hover:bg-[#2d3447] text-[#a8b2c8] rounded-lg text-xs font-medium transition-colors"
                >
                  수정
                </button>
                <button
                  disabled={deleteMutation.isPending}
                  onClick={() => { if (confirm('삭제하시겠습니까?')) deleteMutation.mutate() }}
                  className="px-3 py-1.5 text-red-400 hover:bg-red-400/10 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{post.title}</h1>
          <p className="text-xs text-[#6b7590]">by {post.userName}</p>
        </header>

        <div className="text-sm text-[#a8b2c8] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-6 pt-6 border-t border-[#2a3042]">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 bg-[#4f8ef7]/10 text-[#4f8ef7] text-xs rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
