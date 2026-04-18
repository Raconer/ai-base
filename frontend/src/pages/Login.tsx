import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

interface TokenResponse {
  accessToken: string
  refreshToken: string
  id: number
  email: string
  username: string
  name: string
  role: string
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
    mutationFn: () => api.post<{ data: TokenResponse }>('/auth/login', { email, password }),
    onSuccess: (res) => {
      const { accessToken, refreshToken, id, email: userEmail, username: userUsername, name: userName, role } = res.data.data
      setTokens(accessToken, refreshToken)
      setUser({ id, email: userEmail, username: userUsername, name: userName, role })
      navigate(`/${userUsername}`)
    },
    onError: () => setError('이메일 또는 비밀번호가 올바르지 않습니다'),
  })

  const registerMutation = useMutation({
    mutationFn: () => api.post<{ data: TokenResponse }>('/auth/register', { email, password, username, name }),
    onSuccess: (res) => {
      const { accessToken, refreshToken, id, email: userEmail, username: userUsername, name: userName, role } = res.data.data
      setTokens(accessToken, refreshToken)
      setUser({ id, email: userEmail, username: userUsername, name: userName, role })
      navigate(`/${userUsername}`)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '회원가입에 실패했습니다')
    },
  })

  const isPending = loginMutation.isPending || registerMutation.isPending

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (isRegister) registerMutation.mutate()
    else loginMutation.mutate()
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-[#1a1f2e] rounded-2xl p-6">

        {/* 탭 */}
        <div className="flex gap-1 bg-[#0f1117] rounded-xl p-1 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isRegister ? 'bg-[#252b3b] text-white' : 'text-[#6b7590] hover:text-[#a8b2c8]'
            }`}
            onClick={() => { setSearchParams({}); setError('') }}
          >
            로그인
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              isRegister ? 'bg-[#252b3b] text-white' : 'text-[#6b7590] hover:text-[#a8b2c8]'
            }`}
            onClick={() => { setSearchParams({ mode: 'register' }); setError('') }}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6b7590] uppercase tracking-wider">이름</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  required
                  className="px-4 py-3 bg-[#252b3b] border border-[#2a3042] rounded-xl text-sm text-white placeholder-[#6b7590] outline-none focus:border-[#4f8ef7] focus:ring-1 focus:ring-[#4f8ef7]/30 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6b7590] uppercase tracking-wider">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="hong_gildong"
                  required
                  className="px-4 py-3 bg-[#252b3b] border border-[#2a3042] rounded-xl text-sm text-white placeholder-[#6b7590] outline-none focus:border-[#4f8ef7] focus:ring-1 focus:ring-[#4f8ef7]/30 transition-colors"
                />
                {username && (
                  <p className="text-xs text-[#6b7590]">
                    포트폴리오 주소: <span className="text-[#4f8ef7]">/{username}</span>
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b7590] uppercase tracking-wider">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 bg-[#252b3b] border border-[#2a3042] rounded-xl text-sm text-white placeholder-[#6b7590] outline-none focus:border-[#4f8ef7] focus:ring-1 focus:ring-[#4f8ef7]/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b7590] uppercase tracking-wider">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상"
              required
              className="px-4 py-3 bg-[#252b3b] border border-[#2a3042] rounded-xl text-sm text-white placeholder-[#6b7590] outline-none focus:border-[#4f8ef7] focus:ring-1 focus:ring-[#4f8ef7]/30 transition-colors"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isRegister ? '회원가입' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
