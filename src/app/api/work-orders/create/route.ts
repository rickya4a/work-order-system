import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { generateWorkOrderNumber } from '@/lib/utils'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== 'PRODUCTION_MANAGER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { productName, quantity, deadline, operatorId } = await request.json()

    const workOrder = await prisma.workOrder.create({
      data: {
        orderNumber: generateWorkOrderNumber(),
        productName,
        quantity: parseInt(quantity),
        deadline: new Date(deadline),
        operatorId,
        statusHistory: {
          create: {
            status: 'PENDING',
            quantity: parseInt(quantity),
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

    return NextResponse.json(workOrder)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}