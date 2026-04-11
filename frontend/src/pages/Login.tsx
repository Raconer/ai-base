import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

interface TokenResponse {
  accessToken: string
  refreshToken: string
  username: string
  name: string
}

export default function Login() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isRegister = searchParams.get('mode') === 'register'
  const { setTokens, setUser } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const loginMutation = useMutation({
    mutationFn: () => api.post<{ data: TokenResponse }>('/api/auth/login', { email, password }),
    onSuccess: async (res) => {
      const { accessToken, refreshToken } = res.data.data
      setTokens(accessToken, refreshToken)
      const me = await api.get<{ data: { id: number; email: string; username: string; name: string; role: string } }>('/api/auth/me')
      setUser(me.data.data)
      navigate(`/${me.data.data.username}`)
    },
    onError: () => setError('이메일 또는 비밀번호가 올바르지 않습니다'),
  })

  const registerMutation = useMutation({
    mutationFn: () => api.post<{ data: TokenResponse }>('/api/auth/register', { email, password, username, name }),
    onSuccess: async (res) => {
      const { accessToken, refreshToken } = res.data.data
      setTokens(accessToken, refreshToken)
      const me = await api.get<{ data: { id: number; email: string; username: string; name: string; role: string } }>('/api/auth/me')
      setUser(me.data.data)
      navigate(`/${me.data.data.username}`)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '회원가입에 실패했습니다')
    },
  })

  const isPending = loginMutation.isPending || registerMutation.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (isRegister) registerMutation.mutate()
    else loginMutation.mutate()
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <Card>
        {/* 탭 */}
        <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition ${!isRegister ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setSearchParams({}); setError('') }}
          >
            로그인
          </button>
          <button
            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition ${isRegister ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setSearchParams({ mode: 'register' }); setError('') }}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <Input
                label="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                required
              />
              <div>
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="hong_gildong"
                  required
                />
                {username && (
                  <p className="text-xs text-gray-400 mt-1">
                    내 포트폴리오 주소: <span className="text-blue-500">/{username}</span>
                  </p>
                )}
              </div>
            </>
          )}
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
            placeholder="8자 이상"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" loading={isPending}>
            {isRegister ? '회원가입' : '로그인'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
