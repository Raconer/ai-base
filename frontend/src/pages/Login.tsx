import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: () => api.post<{ data: { accessToken: string; refreshToken: string } }>(
      '/auth/login', { email, password }
    ),
    onSuccess: async (res) => {
      const { accessToken, refreshToken } = res.data.data
      setTokens(accessToken, refreshToken)
      const me = await api.get<{ data: { id: number; email: string; name: string; role: string } }>('/auth/me')
      setUser(me.data.data)
      navigate('/')
    },
    onError: () => setError('이메일 또는 비밀번호가 올바르지 않습니다'),
  })

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">로그인</h1>
        <form onSubmit={(e) => { e.preventDefault(); setError(''); mutation.mutate() }} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" loading={mutation.isPending}>
            로그인
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          계정이 없으신가요?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">회원가입</Link>
        </p>
      </Card>
    </div>
  )
}
