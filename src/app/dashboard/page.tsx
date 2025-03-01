import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { WorkOrderList } from '@/components/work-order/work-order-list'
import { CreateWorkOrderButton } from '@/components/work-order/create-work-order-button'
import { headers } from 'next/headers'

export default async function DashboardPage() {
  await headers()
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-700">Work Orders</h1>
        {user.role === 'PRODUCTION_MANAGER' && <CreateWorkOrderButton />}
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <WorkOrderList userRole={user.role} userId={user.id} />
      </div>
    </div>
  )
}