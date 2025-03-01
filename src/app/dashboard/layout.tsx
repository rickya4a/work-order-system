import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  headers()
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Work Order System
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}