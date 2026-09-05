import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (date) {
    const entry = await prisma.diaryEntry.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: new Date(date),
        },
      },
    })
    return NextResponse.json(entry)
  }

  const limit = Math.min(Number(searchParams.get('limit')) || 10, 50)
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0)

  const rows = await prisma.diaryEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    take: limit + 1,
    skip: offset,
  })

  const hasMore = rows.length > limit

  return NextResponse.json({ entries: rows.slice(0, limit), hasMore })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { date, content } = await request.json()

  if (!date || !content?.trim()) {
    return NextResponse.json(
      { error: 'Date and content are required' },
      { status: 400 }
    )
  }

  const entry = await prisma.diaryEntry.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date: new Date(date),
      },
    },
    update: { content },
    create: {
      userId: session.user.id,
      date: new Date(date),
      content,
    },
  })

  return NextResponse.json(entry)
}
