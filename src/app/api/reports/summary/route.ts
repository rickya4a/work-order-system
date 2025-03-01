import { requireAuth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export async function GET() {
  try {
    const user = await requireAuth()

    if (user.role !== 'PRODUCTION_MANAGER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Work order summary
    const workOrderSummary = await prisma.workOrder.groupBy({
      by: ['productName', 'status'],
      _sum: {
        quantity: true
      }
    })

    // Operator report
    const operatorReport = await prisma.workOrder.groupBy({
      by: ['operatorId', 'productName'],
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        quantity: true
      }
    })

    const operatorsData = await prisma.user.findMany({
      where: {
        role: 'OPERATOR'
      },
      select: {
        id: true,
        name: true
      }
    })

    const operators = Object.fromEntries(
      operatorsData.map(op => [op.id, op.name])
    )

    return NextResponse.json({
      workOrderSummary,
      operatorReport: operatorReport.map(report => ({
        ...report,
        operatorName: operators[report.operatorId]
      }))
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}