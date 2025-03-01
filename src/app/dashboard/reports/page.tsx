'use client'

import { useEffect, useState } from 'react'

interface WorkOrderSummary {
  productName: string
  status: string
  _sum: {
    quantity: number
  }
}

interface OperatorReport {
  productName: string
  operatorId: string
  operatorName: string
  _sum: {
    quantity: number
  }
}

interface ReportData {
  workOrderSummary: WorkOrderSummary[]
  operatorReport: OperatorReport[]
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/reports/summary')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setData(data)
        } else {
          setError(data.error)
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!data) return null

  // Group summary by product
  const summaryByProduct = data.workOrderSummary.reduce((acc, curr) => {
    if (!acc[curr.productName]) {
      acc[curr.productName] = {
        PENDING: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
        CANCELED: 0
      }
    }
    acc[curr.productName][curr.status] = curr._sum.quantity
    return acc
  }, {} as Record<string, Record<string, number>>)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Work Order Summary</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Canceled
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(summaryByProduct).map(([product, quantities]) => (
                <tr key={product}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quantities.PENDING}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quantities.IN_PROGRESS}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quantities.COMPLETED}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quantities.CANCELED}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Operator Report</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Quantity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.operatorReport.map((report, idx) => (
                <tr key={`${report.operatorId}-${report.productName}-${idx}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.operatorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report._sum.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}