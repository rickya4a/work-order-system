import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { WorkOrderStatus } from '@prisma/client'

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const user = await requireAuth()

    if (user.role !== 'PRODUCTION_MANAGER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const workOrderId = id
    const { status, operatorId } = await request.json()

    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
    })

    if (!workOrder) {
      return NextResponse.json(
        { error: 'Work order not found' },
        { status: 404 }
      )
    }

    const updatedWorkOrder = await prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: status as WorkOrderStatus,
        operatorId,
        updatedAt: new Date(),
        statusHistory: {
          create: {
            status: status as WorkOrderStatus,
            quantity: workOrder.quantity,
            notes: `Status updated by manager`,
          },
        },
      },
      include: {
        operator: {
          select: {
            name: true,
          },
        },
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