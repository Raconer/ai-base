import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[#6b7590] uppercase tracking-wider">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 bg-[#252b3b] border rounded-xl text-sm text-white
          placeholder-[#6b7590] outline-none transition-colors
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400/30'
                  : 'border-[#2a3042] focus:border-[#4f8ef7] focus:ring-1 focus:ring-[#4f8ef7]/30'}
          disabled:opacity-50
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
