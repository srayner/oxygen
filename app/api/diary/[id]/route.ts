import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entry = await prisma.diaryEntry.findUnique({
    where: { id: params.id },
  })

  if (!entry) {
    return NextResponse.json(
      { error: 'Diary entry not found' },
      { status: 404 }
    )
  }

  if (entry.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.diaryEntry.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
