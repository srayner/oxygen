-- CreateTable
CREATE TABLE "Sleep" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "bedtime" TEXT NOT NULL,
    "waketime" TEXT NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sleep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sleep_userId_idx" ON "Sleep"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Sleep_userId_date_key" ON "Sleep"("userId", "date");

-- AddForeignKey
ALTER TABLE "Sleep" ADD CONSTRAINT "Sleep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
