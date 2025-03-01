'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

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

export function CreateWorkOrderButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [operators, setOperators] = useState<Operator[]>([])

  useEffect(() => {
    if (isModalOpen) {
      fetchOperators()
    }
  }, [isModalOpen])

  async function fetchOperators() {
    try {
      const res = await fetch('/api/operators')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setOperators(data)
    } catch (err) {
      console.error('Failed to fetch operators:', err)
    }
  }

  const handleClose = () => {
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
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create work order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
      >
        Create Work Order
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-xl shadow-2xl transform transition-all">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Create New Work Order</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter product name"
                    className="w-full h-11 px-4 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter quantity"
                    className="w-full h-11 px-4 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full h-11 px-4 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Operator
                  </label>
                  <select
                    required
                    className="w-full h-11 px-4 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    value={formData.operatorId}
                    onChange={(e) =>
                      setFormData({ ...formData, operatorId: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-500">Select an operator</option>
                    {operators.map((operator) => (
                      <option key={operator.id} value={operator.id}>
                        {operator.name} ({operator.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  className="px-6 py-2.5 text-base font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-base font-medium disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Work Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}