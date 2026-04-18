// useTheme.ts — 라이트/다크 테마 관리 훅
// localStorage → 시스템 설정 → 'light' 순서로 우선순위 결정

import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'

// localStorage 키
const STORAGE_KEY = 'editorial-theme'

// localStorage에서 테마를 안전하게 읽기 (프라이빗 모드/SSR 대비)
function readStorage(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch (e) {
    // 프라이빗 브라우징이나 SSR 환경에서는 접근 불가
    console.error('[useTheme] localStorage 읽기 실패:', e)
  }
  return null
}

// localStorage에 테마를 안전하게 저장
function writeStorage(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (e) {
    console.error('[useTheme] localStorage 저장 실패:', e)
  }
}

// 시스템 다크모드 감지
function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// DOM에 테마 적용
function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export function useTheme() {
  // mounted: SSR hydration 불일치 방지 플래그
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>('light')
  // 사용자가 직접 수동으로 토글했는지 여부 (수동 토글 시 시스템 변경 무시)
  const [userOverride, setUserOverride] = useState(false)

  // 마운트 시: localStorage → 시스템 순서로 초기 테마 결정
  useEffect(() => {
    const stored = readStorage()
    const initial = stored ?? getSystemTheme()
    setThemeState(initial)
    setUserOverride(stored !== null) // 저장된 값이 있으면 사용자 오버라이드로 간주
    applyTheme(initial)
    setMounted(true)
  }, [])

  // 시스템 테마 변경 감지 — 사용자가 수동으로 바꾼 적 없을 때만 따라감
  useEffect(() => {
    if (!mounted) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const handler = (e: MediaQueryListEvent) => {
      if (!userOverride) {
        const next: Theme = e.matches ? 'dark' : 'light'
        setThemeState(next)
        applyTheme(next)
      }
    }

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mounted, userOverride])

  // 외부에서 테마를 명시적으로 설정
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    setUserOverride(true)
    writeStorage(next)
    applyTheme(next)
  }, [])

  // 라이트 ↔ 다크 토글
  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next: Theme = prev === 'light' ? 'dark' : 'light'
      setUserOverride(true)
      writeStorage(next)
      applyTheme(next)
      return next
    })
  }, [])

  return { theme, setTheme, toggleTheme, mounted }
}
