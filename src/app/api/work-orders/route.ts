export const runtime = 'nodejs'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { Prisma, WorkOrderStatus } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const operatorId = searchParams.get('operatorId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Base where clause with user role check
    const where: Prisma.WorkOrderWhereInput = user.role === 'OPERATOR'
      ? { operatorId: user.id }
      : {}

    // Add additional filters
    if (operatorId && user.role !== 'OPERATOR') {
      where.operatorId = operatorId
    }

    if (status) {
      where.status = status as WorkOrderStatus
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const workOrders = await prisma.workOrder.findMany({
      where,
      include: {
        operator: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(workOrders)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}