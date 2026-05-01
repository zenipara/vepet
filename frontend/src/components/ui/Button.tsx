import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'font-medium rounded-lg transition-colors duration-200',
        size === 'sm' && 'px-3 py-1 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-6 py-3 text-lg',
        variant === 'primary' && 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
        variant === 'ghost' && 'bg-transparent text-gray-700 hover:bg-gray-100 disabled:text-gray-400',
        'disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  )
}
