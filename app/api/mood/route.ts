import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const where: { userId: string; date?: { gte?: Date; lte?: Date } } = {
    userId: session.user.id,
  }

  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date.gte = new Date(startDate)
    if (endDate) where.date.lte = new Date(endDate)
  }

  const moods = await prisma.mood.findMany({
    where,
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(moods)
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { date, moodLevel, energyLevel, notes } = await request.json()

  if (!date || moodLevel === undefined || energyLevel === undefined) {
    return NextResponse.json(
      { error: 'Date, moodLevel, and energyLevel are required' },
      { status: 400 }
    )
  }

  if (moodLevel < 1 || moodLevel > 5 || energyLevel < 1 || energyLevel > 5) {
    return NextResponse.json(
      { error: 'moodLevel and energyLevel must be between 1 and 5' },
      { status: 400 }
    )
  }

  const mood = await prisma.mood.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date: new Date(date),
      },
    },
    update: { moodLevel, energyLevel, notes: notes || null },
    create: {
      userId: session.user.id,
      date: new Date(date),
      moodLevel,
      energyLevel,
      notes: notes || null,
    },
  })

  return NextResponse.json(mood)
}
