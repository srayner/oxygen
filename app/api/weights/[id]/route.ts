import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weight = await prisma.weight.findUnique({
    where: { id: params.id },
  });

  if (!weight) {
    return NextResponse.json({ error: "Weight not found" }, { status: 404 });
  }

  if (weight.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.weight.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
