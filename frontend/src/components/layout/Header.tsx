import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function Header() {
  const { isAuthenticated, logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-[#1a1f2e] border-b border-[#2a3042] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="text-base font-bold text-white tracking-tight">
          Portfolio
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/search"
            className="px-3 py-1.5 text-[#a8b2c8] hover:text-white hover:bg-[#252b3b] rounded-lg transition-colors"
          >
            Search
          </Link>

          {isAuthenticated() && user ? (
            <>
              <Link
                to={`/${user.username}`}
                className="px-3 py-1.5 text-[#a8b2c8] hover:text-white hover:bg-[#252b3b] rounded-lg transition-colors"
              >
                @{user.username}
              </Link>
              <Link
                to="/dashboard"
                className="px-3 py-1.5 text-[#a8b2c8] hover:text-white hover:bg-[#252b3b] rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-[#6b7590] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-[#4f8ef7] hover:bg-[#3d7ef6] text-white rounded-lg font-medium transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
