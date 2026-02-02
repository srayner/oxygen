import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface BulkEntry {
  date: string;
  weightKg: number;
}

interface ImportResult {
  imported: number;
  updated: number;
  errors: string[];
}

const MAX_ENTRIES = 1000;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { entries } = (await request.json()) as { entries: BulkEntry[] };

  if (!entries || !Array.isArray(entries)) {
    return NextResponse.json(
      { error: "Entries array is required" },
      { status: 400 }
    );
  }

  if (entries.length > MAX_ENTRIES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_ENTRIES} entries per request` },
      { status: 400 }
    );
  }

  const result: ImportResult = {
    imported: 0,
    updated: 0,
    errors: [],
  };

  // Get existing dates to determine if updating or inserting
  const existingWeights = await prisma.weight.findMany({
    where: {
      userId: session.user.id,
      date: {
        in: entries.map((e) => new Date(e.date)),
      },
    },
    select: { date: true },
  });

  const existingDates = new Set(
    existingWeights.map((w) => w.date.toISOString().split("T")[0])
  );

  // Process in transaction
  await prisma.$transaction(async (tx) => {
    for (const entry of entries) {
      if (!entry.date || entry.weightKg === undefined) {
        result.errors.push(`Invalid entry: missing date or weight`);
        continue;
      }

      const entryDate = new Date(entry.date);
      if (isNaN(entryDate.getTime())) {
        result.errors.push(`Invalid date: ${entry.date}`);
        continue;
      }

      const isUpdate = existingDates.has(entry.date);

      await tx.weight.upsert({
        where: {
          userId_date: {
            userId: session.user.id,
            date: entryDate,
          },
        },
        update: { weightKg: entry.weightKg },
        create: {
          userId: session.user.id,
          date: entryDate,
          weightKg: entry.weightKg,
        },
      });

      if (isUpdate) {
        result.updated++;
      } else {
        result.imported++;
      }
    }
  });

  return NextResponse.json(result);
}
