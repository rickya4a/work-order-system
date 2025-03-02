import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { generateWorkOrderNumber, formatDate } from '@/lib/utils'
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

    const data = await request.json()
    const orderNumber = generateWorkOrderNumber()

    const workOrder = await prisma.workOrder.create({
      data: {
        ...data,
        orderNumber,
        status: 'PENDING',
        createdAt: formatDate(new Date()),
        updatedAt: formatDate(new Date()),
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