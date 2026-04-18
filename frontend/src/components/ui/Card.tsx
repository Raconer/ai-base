import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
}

export default function Card({ label, children, style, ...props }: CardProps) {
  return (
    <div
      className="surface"
      style={{ padding: 24, ...style }}
      {...props}
    >
      {label && (
        <p className="label" style={{ marginBottom: 16, display: 'block' }}>{label}</p>
      )}
      {children}
    </div>
  )
}
