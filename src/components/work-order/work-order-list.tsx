'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Modal } from '../ui/modal'
import { workOrderEvents } from '@/lib/events'
import { StatusHistory } from './status-history'
import { WorkOrderStatus } from '@prisma/client'
import { Pagination } from '@/components/ui/pagination'

interface WorkOrder {
  id: string
  orderNumber: string
  productName: string
  quantity: number
  deadline: string
  status: WorkOrderStatus
  operator: {
    name: string
  }
  operatorId: string
  createdAt: string
  statusHistory: {
    id: string
    status: WorkOrderStatus
    stage?: string
    quantity: number
    notes?: string
    createdAt: string
    completedAt?: string
  }[]
}

interface Filters {
  status?: string
  startDate?: string
  endDate?: string
}

interface StatusUpdateForm {
  stage?: string
  quantity: number
}

export function WorkOrderList(
  {
    userRole,
    userId,
  }: {
    userRole: string
    userId: string
  }
) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<{
    id: string
    status: string
  } | null>(null)
  const [filters, setFilters] = useState<Filters>({})
  const [operators, setOperators] = useState<{ id: string; name: string }[]>([])
  const [editWorkOrder, setEditWorkOrder] = useState<{
    id: string;
    operatorId: string;
    status: string;
  } | null>(null)
  const [statusForm, setStatusForm] = useState<StatusUpdateForm>({
    stage: '',
    quantity: 0
  })
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchWorkOrders()

    // Subscribe to work order creation events
    workOrderEvents.on('workOrderCreated', fetchWorkOrders)

    // Cleanup subscription
    return () => {
      workOrderEvents.off('workOrderCreated', fetchWorkOrders)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, pagination.limit])

  async function fetchWorkOrders() {
    try {
      setLoading(true)

      let url = userRole === 'OPERATOR'
        ? `/api/work-orders?operatorId=${userId}`
        : '/api/work-orders'

      // Add pagination params
      const params = new URLSearchParams()
      params.append('page', pagination.page.toString())
      params.append('limit', pagination.limit.toString())

      // Add filters
      if (filters.status) params.append('status', filters.status)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      url += `${url.includes('?') ? '&' : '?'}${params.toString()}`

      const res = await fetch(url)
      const { data, pagination: paginationData } = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setWorkOrders(data)
      setPagination(prev => ({ ...prev, ...paginationData }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load work orders')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(
    workOrderId: string,
    newStatus: string,
    currentQuantity: number
  ) {
    setStatusForm(prev => ({ ...prev, quantity: currentQuantity }))

    if (newStatus === 'IN_PROGRESS') {
      setSelectedWorkOrder({ id: workOrderId, status: newStatus })
      setIsModalOpen(true)
      return
    }

    if (newStatus === 'COMPLETED') {
      setSelectedWorkOrder({ id: workOrderId, status: newStatus })
      setIsModalOpen(true)
      return
    }

    await updateWorkOrderStatus(workOrderId, newStatus)
  }

  async function updateWorkOrderStatus(workOrderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/work-orders/${workOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          stage: statusForm.stage,
          quantity: statusForm.quantity,
          notes: `Status diubah ke ${newStatus}${statusForm.stage ? ` - ${statusForm.stage}` : ''} (Quantity: ${statusForm.quantity})`
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


  // Fetch operators for reassignment
  async function fetchOperators() {
    try {
      const res = await fetch('/api/operators')
      const data = await res.json()
      setOperators(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load operators')
    }
  }

  // Add this function
  async function handleEditWorkOrder(workOrderId: string, newStatus: string, newOperatorId: string) {
    try {
      const res = await fetch(`/api/work-orders/${workOrderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          operatorId: newOperatorId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      await fetchWorkOrders()
      setEditWorkOrder(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update work order')
    }
  }

  const inputClassName = "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

  // Handle page change
  const handlePageChange = (page: number) => {
    // Simpan posisi scroll sekarang
    const currentScroll = window.scrollY

    setPagination(prev => ({ ...prev, page }))

    // Kembalikan ke posisi scroll sebelumnya
    window.scrollTo({
      top: currentScroll,
      behavior: 'instant' // Gunakan 'instant' agar tidak ada animasi
    })
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      {userRole === 'PRODUCTION_MANAGER' && (
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className={inputClassName}
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className={inputClassName}
                value={filters.startDate || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className={inputClassName}
                value={filters.endDate || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col h-[calc(100vh-250px)]">
        <div className="flex-1 overflow-auto bg-white rounded-lg shadow">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  History
                </th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(new Date(workOrder.createdAt))}
                  </td>
                  {userRole === 'OPERATOR' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workOrder.status === 'PENDING' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(workOrder.id, 'IN_PROGRESS', workOrder.quantity)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start Work
                        </Button>
                      )}
                      {workOrder.status === 'IN_PROGRESS' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(workOrder.id, 'COMPLETED', workOrder.quantity)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete
                        </Button>
                      )}
                    </td>
                  )}
                  {userRole === 'PRODUCTION_MANAGER' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditWorkOrder({
                            id: workOrder.id,
                            operatorId: workOrder.operatorId,
                            status: workOrder.status,
                          })
                          fetchOperators()
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedHistory(workOrder.id)}
                    >
                      View History
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedWorkOrder(null)
          setStatusForm({ stage: '', quantity: 0 })
        }}
        title={selectedWorkOrder?.status === 'IN_PROGRESS' ? 'Start Production' : 'Complete Production'}
      >
        <div className="space-y-4">
          {selectedWorkOrder?.status === 'IN_PROGRESS' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <input
                type="text"
                value={statusForm.stage || ''}
                onChange={(e) => setStatusForm(prev => ({ ...prev, stage: e.target.value }))}
                className={inputClassName}
                placeholder="Ex: Cutting, Assembly, etc"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="0"
              value={statusForm.quantity}
              onChange={(e) => setStatusForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              className={inputClassName}
              placeholder="Enter quantity"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false)
                setSelectedWorkOrder(null)
                setStatusForm({ stage: '', quantity: 0 })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedWorkOrder) {
                  updateWorkOrderStatus(selectedWorkOrder.id, selectedWorkOrder.status)
                  setIsModalOpen(false)
                  setSelectedWorkOrder(null)
                  setStatusForm({ stage: '', quantity: 0 })
                }
              }}
              disabled={!statusForm.quantity || (selectedWorkOrder?.status === 'IN_PROGRESS' && !statusForm.stage)}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!editWorkOrder}
        onClose={() => setEditWorkOrder(null)}
        title="Edit Work Order"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className={inputClassName}
              value={editWorkOrder?.status || ''}
              onChange={(e) => setEditWorkOrder(prev => prev ? { ...prev, status: e.target.value } : null)}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reassign Operator
            </label>
            <select
              className={inputClassName}
              value={editWorkOrder?.operatorId || ''}
              onChange={(e) => setEditWorkOrder(prev => prev ? { ...prev, operatorId: e.target.value } : null)}
            >
              {operators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setEditWorkOrder(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editWorkOrder) {
                  handleEditWorkOrder(
                    editWorkOrder.id,
                    editWorkOrder.status,
                    editWorkOrder.operatorId
                  )
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedHistory}
        onClose={() => setSelectedHistory(null)}
        title="Work Order History"
      >
        {selectedHistory && (
          <StatusHistory
            history={workOrders.find(wo => wo.id === selectedHistory)?.statusHistory || []}
          />
        )}
      </Modal>
    </div>
  )
}