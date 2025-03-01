import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    (await cookies()).delete('token')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}