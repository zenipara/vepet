import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { analyticsService } from '@/features/analytics/services/analyticsService'

import React, { useEffect, useState } from 'react'

type PublicTheme = 'soft' | 'vivid'

export const PublicLayout: React.FC = () => {
  const [theme, setTheme] = useState<PublicTheme>('vivid')

  useEffect(() => {
    const savedTheme = localStorage.getItem('vetcare-public-theme') as PublicTheme | null
    if (savedTheme === 'soft' || savedTheme === 'vivid') {
      setTheme(savedTheme)
    }
  }, [])

  const handleToggleTheme = () => {
    const nextTheme: PublicTheme = theme === 'vivid' ? 'soft' : 'vivid'
    setTheme(nextTheme)
    localStorage.setItem('vetcare-public-theme', nextTheme)
    analyticsService.trackThemeToggle(nextTheme)
  }

  return (
    <div className={`${theme === 'vivid' ? 'public-theme-vivid' : ''} flex min-h-screen flex-col bg-slate-50`}>
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
