import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await compare(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}