'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Modal } from '../ui/modal'
import { workOrderEvents } from '@/lib/events'

interface WorkOrder {
  id: string
  orderNumber: string
  productName: string
  quantity: number
  deadline: string
  status: string
  operator: {
    name: string
  }
}

export function WorkOrderList({ userRole, userId }: { userRole: string; userId: string }) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<{ id: string; status: string } | null>(null)
  const [stage, setStage] = useState('')

  useEffect(() => {
    fetchWorkOrders()

    // Subscribe to work order creation events
    workOrderEvents.on('workOrderCreated', fetchWorkOrders)

    // Cleanup subscription
    return () => {
      workOrderEvents.off('workOrderCreated', fetchWorkOrders)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchWorkOrders() {
    try {
      const url = userRole === 'OPERATOR'
        ? `/api/work-orders?operatorId=${userId}`
        : '/api/work-orders'

      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setWorkOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load work orders')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(workOrderId: string, newStatus: string) {
    if (newStatus === 'IN_PROGRESS') {
      setSelectedWorkOrder({ id: workOrderId, status: newStatus })
      setIsModalOpen(true)
      return
    }

    await updateWorkOrderStatus(workOrderId, newStatus)
  }

  async function updateWorkOrderStatus(workOrderId: string, newStatus: string, stageValue?: string) {
    try {
      const res = await fetch(`/api/work-orders/${workOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          stage: stageValue,
          notes: `Status diubah ke ${newStatus}${stageValue ? ` - ${stageValue}` : ''}`
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      await fetchWorkOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  function handleSubmitStage() {
    if (selectedWorkOrder && stage.trim()) {
      updateWorkOrderStatus(selectedWorkOrder.id, selectedWorkOrder.status, stage)
      setIsModalOpen(false)
      setSelectedWorkOrder(null)
      setStage('')
    }
  }

  const inputClassName = "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operator
              </th>
              {userRole === 'OPERATOR' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workOrders.map((workOrder) => (
              <tr key={workOrder.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {workOrder.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {workOrder.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {workOrder.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(new Date(workOrder.deadline))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workOrder.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    workOrder.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    workOrder.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {workOrder.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {workOrder.operator.name}
                </td>
                {userRole === 'OPERATOR' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workOrder.status === 'PENDING' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(workOrder.id, 'IN_PROGRESS')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Start Work
                      </Button>
                    )}
                    {workOrder.status === 'IN_PROGRESS' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(workOrder.id, 'COMPLETED')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Complete
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedWorkOrder(null)
          setStage('')
        }}
        title="Enter Production Stage"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
              Stage
            </label>
            <input
              type="text"
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className={inputClassName}
              placeholder="Ex: Cutting, Assembly, etc"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false)
                setSelectedWorkOrder(null)
                setStage('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitStage}
              disabled={!stage.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}