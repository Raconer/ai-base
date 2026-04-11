import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserPortfolio from './pages/UserPortfolio'
import UserBlog from './pages/UserBlog'
import PostDetail from './pages/PostDetail'
import PostEditor from './pages/PostEditor'
import UserResume from './pages/UserResume'
import Search from './pages/Search'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* 서비스 공통 */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />

            {/* 개인 포트폴리오 (/:username 기반) */}
            <Route path="/:username" element={<UserPortfolio />} />
            <Route path="/:username/blog" element={<UserBlog />} />
            <Route path="/:username/blog/:id" element={<PostDetail />} />
            <Route path="/:username/blog/new" element={<PostEditor />} />
            <Route path="/:username/blog/:id/edit" element={<PostEditor />} />
            <Route path="/:username/resume" element={<UserResume />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
