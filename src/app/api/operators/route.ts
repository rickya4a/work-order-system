import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const operators = await prisma.user.findMany({
      where: {
        role: 'OPERATOR'
      },
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(operators)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}