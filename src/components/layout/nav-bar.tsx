'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/auth/sign-out-button'

interface NavBarProps {
  user: {
    name: string
    role: string
  }
}

export function NavBar({ user }: NavBarProps) {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Work Order System
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user.role === 'PRODUCTION_MANAGER' && (
              <>
                <div className="flex items-center space-x-2">
                  <Link
                    href="/dashboard/reports"
                    className={`${
                      pathname === '/dashboard/reports' ? 'text-blue-600' : 'text-gray-700'
                    } hover:text-gray-500`}
                  >
                    Reports
                  </Link>
                </div>
              </>
            )}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {user.name[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  )
}