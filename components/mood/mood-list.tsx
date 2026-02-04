'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getMoodEmoji,
  getMoodLabel,
  getEnergyEmoji,
  getEnergyLabel,
} from '@/lib/mood-utils'

interface MoodEntry {
  id: string
  date: string
  moodLevel: number
  energyLevel: number
  notes?: string | null
}

interface MoodListProps {
  moods: MoodEntry[]
  onDelete: (id: string) => void
}

export function MoodList({ moods, onDelete }: MoodListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/mood/${id}`, { method: 'DELETE' })
      if (res.ok) {
        onDelete(id)
      }
    } finally {
      setDeletingId(null)
    }
  }

  const sortedMoods = moods
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedMoods.length === 0 ? (
          <p className="py-4 text-center text-muted-foreground">
            No entries yet.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedMoods.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      <span className="text-lg">
                        {getMoodEmoji(entry.moodLevel)}
                      </span>{' '}
                      <span className="text-muted-foreground">
                        {getMoodLabel(entry.moodLevel)}
                      </span>
                    </span>
                    <span className="text-sm">
                      <span className="text-lg">
                        {getEnergyEmoji(entry.energyLevel)}
                      </span>{' '}
                      <span className="text-muted-foreground">
                        {getEnergyLabel(entry.energyLevel)}
                      </span>
                    </span>
                  </div>
                  {entry.notes && (
                    <span className="text-sm italic text-muted-foreground">
                      {entry.notes}
                    </span>
                  )}
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
