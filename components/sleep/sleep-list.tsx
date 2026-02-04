'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDuration, formatTime } from '@/lib/sleep-utils'

interface SleepEntry {
  id: string
  date: string
  bedtime: string
  waketime: string
  durationMins: number
}

interface SleepListProps {
  sleeps: SleepEntry[]
  onDelete: (id: string) => void
}

export function SleepList({ sleeps, onDelete }: SleepListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/sleep/${id}`, { method: 'DELETE' })
      if (res.ok) {
        onDelete(id)
      }
    } finally {
      setDeletingId(null)
    }
  }

  const sortedSleeps = sleeps
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedSleeps.length === 0 ? (
          <p className="py-4 text-center text-muted-foreground">
            No entries yet.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedSleeps.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="font-medium">
                    {formatDuration(entry.durationMins)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(entry.bedtime)} - {formatTime(entry.waketime)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
