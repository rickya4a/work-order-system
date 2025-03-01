import { jwtVerify } from 'jose/jwt/verify'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

export async function getSession() {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    )

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return user
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function requireAuth() {
  const user = await getSession()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}