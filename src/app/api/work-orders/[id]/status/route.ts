export const runtime = 'nodejs'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const workOrderId = params.id
    const user = await requireAuth()

    if (user.role !== 'OPERATOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { status, quantity, stage, notes } = await request.json()

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

    const previousStatus = await prisma.statusHistory.findFirst({
      where: { workOrderId },
      orderBy: { createdAt: 'desc' }
    })

    if (previousStatus?.status === status) {
      return NextResponse.json(
        { error: 'Status cannot be the same as the previous status' },
        { status: 400 }
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
            stage,
            notes,
            completedAt: status === 'COMPLETED' ? new Date() : null,
          },
        },
      },
      include: {
        operator: {
          select: {
            name: true,
          },
        },
        statusHistory: true
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