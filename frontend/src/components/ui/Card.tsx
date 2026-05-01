import clsx from 'clsx'

interface CardProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export const Card = ({ className, children, onClick }: CardProps) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
        onClick && 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform transition-shadow motion-safe:transform',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-200',
        className
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  )
}
