import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateDurationMins } from '@/lib/sleep-utils'

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

  const sleeps = await prisma.sleep.findMany({
    where,
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(sleeps)
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { date, bedtime, waketime } = await request.json()

  if (!date || !bedtime || !waketime) {
    return NextResponse.json(
      { error: 'Date, bedtime, and waketime are required' },
      { status: 400 }
    )
  }

  const durationMins = calculateDurationMins(bedtime, waketime)

  const sleep = await prisma.sleep.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date: new Date(date),
      },
    },
    update: { bedtime, waketime, durationMins },
    create: {
      userId: session.user.id,
      date: new Date(date),
      bedtime,
      waketime,
      durationMins,
    },
  })

  return NextResponse.json(sleep)
}
