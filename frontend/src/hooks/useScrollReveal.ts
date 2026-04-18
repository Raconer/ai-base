// useScrollReveal.ts — 스크롤 위치 기반 요소 노출 애니메이션 훅
// IntersectionObserver로 뷰포트 진입 시 .is-visible 클래스를 트리거

import { useEffect, useRef, useState } from 'react'

interface ScrollRevealOptions {
  // 요소가 얼마나 보여야 트리거할지 (0~1), 기본값 0.15
  threshold?: number
  // 뷰포트 기준 margin, 기본값 하단 80px 앞에서 미리 트리거
  rootMargin?: string
  // true면 한 번 노출 후 observer 해제 (기본값 true)
  once?: boolean
}

interface ScrollRevealResult<T extends HTMLElement> {
  ref: React.RefObject<T>
  isVisible: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): ScrollRevealResult<T> {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -80px 0px',
    once = true,
  } = options

  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // prefers-reduced-motion: 애니메이션 비활성화 시 즉시 표시
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setIsVisible(true)
      return
    }

    // IntersectionObserver 미지원 환경 폴백 (IE 등)
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // once: true 이면 노출 후 observer 해제하여 리소스 절약
            if (once) observer.disconnect()
          } else if (!once) {
            // once: false 이면 뷰포트 이탈 시 다시 숨김
            setIsVisible(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(el)

    // 컴포넌트 언마운트 시 observer 해제
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}
