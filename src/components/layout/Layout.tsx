import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 min-h-screen flex flex-col pb-16 md:pb-0">
        {children}
      </div>
      <MobileNav />
    </div>
  )
}
