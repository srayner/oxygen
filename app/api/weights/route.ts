import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const where: { userId: string; date?: { gte?: Date; lte?: Date } } = {
    userId: session.user.id,
  };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const weights = await prisma.weight.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return NextResponse.json(weights);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, weightKg } = await request.json();

  if (!date || weightKg === undefined) {
    return NextResponse.json(
      { error: "Date and weight are required" },
      { status: 400 }
    );
  }

  const weight = await prisma.weight.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date: new Date(date),
      },
    },
    update: { weightKg },
    create: {
      userId: session.user.id,
      date: new Date(date),
      weightKg,
    },
  });

  return NextResponse.json(weight);
}
