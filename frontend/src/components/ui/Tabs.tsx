import { ReactNode, useState } from 'react'

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export const Tabs = ({ defaultValue, children, className = '' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className={className} data-active-tab={activeTab}>
      {typeof children === 'function'
        ? children
        : Array.isArray(children)
          ? children.map(child =>
              child?.type?.name === 'TabsList' || child?.type?.name === 'TabsContent'
                ? { ...child, props: { ...child.props, activeTab, setActiveTab } }
                : child,
            )
          : children}
    </div>
  )
}

export const TabsList = ({ children, className = '' }: TabsListProps & any) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export const TabsTrigger = ({ value, children, ...props }: TabsTriggerProps & any) => {
  const isActive = props.activeTab === value

  return (
    <button
      onClick={() => props.setActiveTab?.(value)}
      className={`px-4 py-3 font-medium transition-colors border-b-2 ${
        isActive
          ? 'border-b-emerald-500 text-emerald-600'
          : 'border-b-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, children, className = '', ...props }: TabsContentProps & any) => {
  const isActive = props.activeTab === value

  if (!isActive) return null

  return <div className={className}>{children}</div>
}
