import { handler } from '@srayner02/svix-admin/server'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ path: string[] }> }

async function protect() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function GET(req: Request, ctx: Ctx) {
  return (await protect()) ?? handler(req, ctx)
}
export async function POST(req: Request, ctx: Ctx) {
  return (await protect()) ?? handler(req, ctx)
}
export async function PATCH(req: Request, ctx: Ctx) {
  return (await protect()) ?? handler(req, ctx)
}
export async function DELETE(req: Request, ctx: Ctx) {
  return (await protect()) ?? handler(req, ctx)
}
