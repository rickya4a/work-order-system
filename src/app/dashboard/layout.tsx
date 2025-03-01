import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { NavBar } from '@/components/layout/nav-bar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await headers()
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar user={user} />
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}