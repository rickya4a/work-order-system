export const runtime = 'nodejs'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const operatorId = searchParams.get('operatorId')
    console.log(operatorId)

    const workOrders = await prisma.workOrder.findMany({
      where: user.role === 'OPERATOR' ? { operatorId: user.id } : {},
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