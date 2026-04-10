/**
 * 날짜 포맷 (2026-04-09 → 2026년 4월 9일)
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * 상대 시간 (3분 전, 2시간 전, 어제...)
 */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  return formatDate(dateStr)
}

/**
 * 텍스트 자르기
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * 감성 분석 레이블 한글 변환
 */
export function sentimentLabel(label: string): string {
  const map: Record<string, string> = {
    POSITIVE: '긍정',
    NEGATIVE: '부정',
    NEUTRAL: '중립',
  }
  return map[label] ?? label
}

/**
 * 바이트를 읽기 쉬운 단위로 변환
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * 클래스명 병합 (Tailwind 조건부 클래스)
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
