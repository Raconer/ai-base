export const API_BASE = '/api'

export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  POST_DETAIL: (id: number | string) => `/blog/${id}`,
  POST_NEW: '/blog/new',
  POST_EDIT: (id: number | string) => `/blog/${id}/edit`,
  RESUME: '/resume',
  SEARCH: '/search',
  ABOUT: '/about',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const

export const POST_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const

export const SENTIMENT_COLORS = {
  POSITIVE: 'text-green-600',
  NEGATIVE: 'text-red-600',
  NEUTRAL: 'text-gray-500',
} as const

export const LLM_TONE_OPTIONS = [
  { value: 'natural', label: '원문 유지' },
  { value: 'formal', label: '격식체' },
  { value: 'casual', label: '구어체' },
  { value: 'technical', label: '기술적' },
] as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const
