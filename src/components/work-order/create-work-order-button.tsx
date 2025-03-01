'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { workOrderEvents } from '@/lib/events'

interface Operator {
  id: string
  name: string
  email: string
}

const initialFormData = {
  productName: '',
  quantity: '',
  deadline: '',
  operatorId: '',
}

interface CreateWorkOrderButtonProps {
  onSuccess?: () => void
}

export function CreateWorkOrderButton({ onSuccess }: CreateWorkOrderButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [operators, setOperators] = useState<Operator[]>([])

  async function fetchOperators() {
    try {
      const res = await fetch('/api/operators')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setOperators(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load operators')
    }
  }

  function handleOpen() {
    setIsModalOpen(true)
    fetchOperators()
  }

  function handleClose() {
    setIsModalOpen(false)
    setFormData(initialFormData)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/work-orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      handleClose()
      workOrderEvents.emit('workOrderCreated')

      if (typeof onSuccess === 'function') {
        onSuccess()
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create work order'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClassName = "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

  return (
    <>
      <Button onClick={handleOpen}>
        Create Work Order
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Create New Work Order"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              required
              className={inputClassName}
              placeholder="Enter product name"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              required
              min="1"
              className={inputClassName}
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="datetime-local"
              id="deadline"
              required
              className={inputClassName}
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="operatorId" className="block text-sm font-medium text-gray-700 mb-1">
              Assign Operator
            </label>
            <select
              id="operatorId"
              required
              className={inputClassName}
              value={formData.operatorId}
              onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
            >
              <option value="">Select an operator</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operator.name} ({operator.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Work Order'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}