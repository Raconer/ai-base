import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean
  label?: string
}

export default function Card({ children, padding = true, label, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-[#1a1f2e] rounded-2xl ${padding ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {label && (
        <p className="text-xs font-medium text-[#6b7590] uppercase tracking-wider mb-3">{label}</p>
      )}
      {children}
    </div>
  )
}
