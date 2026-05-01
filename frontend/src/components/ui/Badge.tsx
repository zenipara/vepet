import clsx from 'clsx'

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'
  children: React.ReactNode
  className?: string
}

export const Badge = ({ variant = 'primary', children, className }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-block px-2 py-1 rounded-full text-xs font-medium',
        variant === 'primary' && 'bg-blue-100 text-blue-800',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'warning' && 'bg-amber-100 text-amber-800',
        variant === 'danger' && 'bg-red-100 text-red-800',
        variant === 'info' && 'bg-cyan-100 text-cyan-800',
        variant === 'secondary' && 'bg-gray-100 text-gray-800',
        className
      )}
    >
      {children}
    </span>
  )
}
