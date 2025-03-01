export const runtime = 'nodejs'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const workOrderId = await Promise.resolve(params.id)
    const user = await requireAuth()

    if (user.role !== 'OPERATOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { status, quantity } = await request.json()

    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
    })

    if (!workOrder) {
      return NextResponse.json(
        { error: 'Work order not found' },
        { status: 404 }
      )
    }

    if (workOrder.operatorId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updatedWorkOrder = await prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            quantity: quantity || workOrder.quantity,
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