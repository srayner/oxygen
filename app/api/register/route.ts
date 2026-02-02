import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json()

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    const userRole = await prisma.role.findUnique({
      where: { name: 'user' },
    })

    if (!userRole) {
      return NextResponse.json(
        { error: 'Default role not found. Please run database fixtures.' },
        { status: 500 }
      )
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        hashedPassword,
        roleId: userRole.id,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
