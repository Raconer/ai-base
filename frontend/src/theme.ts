/**
 * 디자인 토큰 — dark/light 모드 공통 색상 기준.
 * Tailwind 클래스와 함께 사용. CSS 변수 기반.
 */
export const theme = {
  colors: {
    primary: {
      DEFAULT: '#3B82F6',   // blue-500
      hover: '#2563EB',     // blue-600
      light: '#EFF6FF',     // blue-50
    },
    success: '#22C55E',     // green-500
    error: '#EF4444',       // red-500
    warning: '#F59E0B',     // amber-500
    info: '#6366F1',        // indigo-500
  },
  sentiment: {
    positive: '#22C55E',    // green-500
    negative: '#EF4444',    // red-500
    neutral: '#6B7280',     // gray-500
  },
  border: {
    DEFAULT: '#E5E7EB',     // gray-200
    dark: '#374151',        // gray-700
  },
} as const

export type ThemeColors = typeof theme
