import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let preferences = await prisma.preferences.findUnique({
    where: { userId: session.user.id },
  });

  if (!preferences) {
    preferences = await prisma.preferences.create({
      data: { userId: session.user.id },
    });
  }

  return NextResponse.json(preferences);
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { weightUnit } = await request.json();

  if (weightUnit && !["kg", "imperial"].includes(weightUnit)) {
    return NextResponse.json(
      { error: 'Weight unit must be "kg" or "imperial"' },
      { status: 400 }
    );
  }

  const preferences = await prisma.preferences.upsert({
    where: { userId: session.user.id },
    update: { weightUnit },
    create: { userId: session.user.id, weightUnit },
  });

  return NextResponse.json(preferences);
}
