export const runtime = 'nodejs'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { WorkOrderStatus } from '@prisma/client'

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await props.params
    const workOrderId = id
    const { status, stage, quantity, notes } = await request.json()

    // Get previous status history
    const previousStatus = await prisma.statusHistory.findFirst({
      where: { workOrderId },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate time spent on previous status
    if (previousStatus && !previousStatus.completedAt) {
      await prisma.statusHistory.update({
        where: { id: previousStatus.id },
        data: {
          completedAt: new Date()
        }
      })
    }

    // Validate quantity
    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      )
    }

    // For operators, validate status transitions
    if (user.role === 'OPERATOR') {
      const workOrder = await prisma.workOrder.findUnique({
        where: { id: workOrderId },
      })

      if (!workOrder) {
        return NextResponse.json(
          { error: 'Work order not found' },
          { status: 404 }
        )
      }

      // Only allow specific transitions
      const allowedTransitions = {
        PENDING: ['IN_PROGRESS'],
        IN_PROGRESS: ['COMPLETED'],
      }

      if (
        !allowedTransitions[workOrder.status as keyof typeof allowedTransitions]?.includes(status) ||
        workOrder.operatorId !== user.id
      ) {
        return NextResponse.json(
          { error: 'Invalid status transition' },
          { status: 400 }
        )
      }
    }

    // Create new status history
    const updatedWorkOrder = await prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: status as WorkOrderStatus,
        updatedAt: new Date(),
        statusHistory: {
          create: {
            status: status as WorkOrderStatus,
            quantity,
            stage,
            notes,
            createdAt: new Date(),
            // Set completedAt only if status is COMPLETED
            completedAt: status === 'COMPLETED' ? new Date() : null
          },
        },
      },
      include: {
        operator: {
          select: {
            name: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
    })

    return NextResponse.json(updatedWorkOrder)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}