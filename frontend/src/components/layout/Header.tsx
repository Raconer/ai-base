import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useTheme } from '../../hooks/useTheme'

export default function Header() {
  const { isAuthenticated, logout, user } = useAuthStore()
  const { theme, toggleTheme, mounted } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      {/* 좌 — 브랜드 */}
      <div className="header__left">
        <Link to="/">PORTFOLIO</Link>
      </div>

      {/* 중앙 — 현재 섹션 */}
      <div className="header__center">
        <span>AI BASE</span>
      </div>

      {/* 우 — 네비게이션 */}
      <div className="header__right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
        <Link to="/search">SEARCH</Link>

        {isAuthenticated() && user ? (
          <>
            <Link to={`/${user.username}`}>@{user.username.toUpperCase()}</Link>
            <Link to="/dashboard">DASHBOARD</Link>
            <button onClick={handleLogout}>LOGOUT</button>
          </>
        ) : (
          <Link to="/login">LOGIN</Link>
        )}

        {/* 테마 토글 — mounted 전에는 렌더 안 함 (hydration 불일치 방지) */}
        {mounted && (
          <button
            onClick={toggleTheme}
            aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {theme === 'light' ? '◐' : '◑'}
          </button>
        )}
      </div>
    </header>
  )
}
