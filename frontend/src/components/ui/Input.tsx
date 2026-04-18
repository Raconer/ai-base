import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {label && <span className="label">{label}</span>}
        <input
          ref={ref}
          className={`input ${className}`}
          {...props}
        />
        {error && (
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
