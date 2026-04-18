import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const cls = variant === 'ghost' ? 'btn btn--ghost' : 'btn'
  return (
    <button
      className={`${cls} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 8, animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="40" strokeDashoffset="10" />
        </svg>
      )}
      {children}
    </button>
  )
}
