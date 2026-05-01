import clsx from 'clsx'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow-sm border border-gray-200 p-6', className)}>
      {children}
    </div>
  )
}
