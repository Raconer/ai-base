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
      const { accessToken, refreshToken, id, email: e, username: u, name: n, role } = res.data.data
      setTokens(accessToken, refreshToken)
      setUser({ id, email: e, username: u, name: n, role })
      navigate(`/${u}`)
    },
    onError: () => setError('이메일 또는 비밀번호가 올바르지 않습니다'),
  })

  const registerMutation = useMutation({
    mutationFn: () => api.post<{ data: TokenResponse }>('/auth/register', { email, password, username, name }),
    onSuccess: (res) => {
      const { accessToken, refreshToken, id, email: e, username: u, name: n, role } = res.data.data
      setTokens(accessToken, refreshToken)
      setUser({ id, email: e, username: u, name: n, role })
      navigate(`/${u}`)
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
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      padding: 'calc(var(--section-spacing)) var(--padding-desktop)',
    }}>
      <p className="label" style={{ marginBottom: 32 }}>{isRegister ? 'Register' : 'Login'}</p>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: 48, color: 'var(--fg)' }}>
        {isRegister ? '계정 만들기' : '로그인'}
      </h1>

      {/* 탭 */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--divider)', marginBottom: 40 }}>
        <button
          onClick={() => { setSearchParams({}); setError('') }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 0', marginRight: 32,
            fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: !isRegister ? 'var(--fg)' : 'var(--fg-muted)',
            borderBottom: !isRegister ? '2px solid var(--fg)' : '2px solid transparent',
            fontFamily: 'var(--font-sans)',
          }}
        >
          로그인
        </button>
        <button
          onClick={() => { setSearchParams({ mode: 'register' }); setError('') }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 0',
            fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: isRegister ? 'var(--fg)' : 'var(--fg-muted)',
            borderBottom: isRegister ? '2px solid var(--fg)' : '2px solid transparent',
            fontFamily: 'var(--font-sans)',
          }}
        >
          회원가입
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {isRegister && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="label">이름</span>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="label">Username</span>
              <input
                className="input"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="hong_gildong"
                required
              />
              {username && (
                <span className="label">포트폴리오: /{username}</span>
              )}
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="label">이메일</span>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="label">비밀번호</span>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8자 이상" required />
        </div>

        {error && <p style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{error}</p>}

        <button type="submit" className="btn" disabled={isPending} style={{ marginTop: 8 }}>
          {isPending ? '처리 중...' : (isRegister ? '회원가입' : '로그인')}
        </button>
      </form>
    </div>
  )
}
