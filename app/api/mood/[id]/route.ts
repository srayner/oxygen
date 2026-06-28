import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEvent } from '@/lib/svix'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mood = await prisma.mood.findUnique({
    where: { id: params.id },
  })

  if (!mood) {
    return NextResponse.json({ error: 'Mood entry not found' }, { status: 404 })
  }

  if (mood.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.mood.delete({
    where: { id: params.id },
  })

  sendEvent('mood.log.deleted', {
    id: mood.id,
    userId: mood.userId,
    date: mood.date,
  })

  return NextResponse.json({ success: true })
}
