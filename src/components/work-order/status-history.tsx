'use client'

import { formatDate, formatDuration } from '@/lib/utils'
import { WorkOrderStatus } from '@prisma/client'

interface StatusHistoryProps {
  history: {
    id: string
    status: WorkOrderStatus
    stage?: string
    quantity: number
    notes?: string
    createdAt: string
    completedAt?: string
  }[]
}

export function StatusHistory({ history }: StatusHistoryProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Production History</h4>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {history.map((status, idx) => (
            <li key={status.id}>
              <div className="relative pb-8">
                {idx !== history.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      status.status === 'PENDING' ? 'bg-yellow-500' :
                      status.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                      status.status === 'COMPLETED' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}>
                      <span className="text-white text-sm">{status.status[0]}</span>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {status.notes}
                        {status.stage && (
                          <span className="font-medium text-gray-900">
                            {' '}({status.stage})
                          </span>
                        )}
                        <span className="text-gray-400 ml-2">
                          Quantity: {status.quantity}
                        </span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <div>{formatDate(status.createdAt)}</div>
                      {status.completedAt && (
                        <div className="text-xs text-gray-400">
                          Duration: {formatDuration(new Date(status.createdAt), new Date(status.completedAt))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}