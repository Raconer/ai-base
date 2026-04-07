import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'

export default function Header() {
  const { isAuthenticated, logout, user } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-blue-600 dark:text-blue-400">
          AI Base
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link to="/blog" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Blog</Link>
          <Link to="/search" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Search</Link>
          <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">About</Link>

          {isAuthenticated() ? (
            <>
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                {user?.name ?? 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Login
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  )
}
