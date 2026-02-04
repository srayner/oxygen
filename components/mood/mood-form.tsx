'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getToday, MOOD_LEVELS, ENERGY_LEVELS } from '@/lib/mood-utils'
import { cn } from '@/lib/utils'

interface MoodFormProps {
  onSuccess: () => void
}

export function MoodForm({ onSuccess }: MoodFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState(getToday())
  const [moodLevel, setMoodLevel] = useState<number | null>(null)
  const [energyLevel, setEnergyLevel] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!date) {
      setError('Date is required')
      return
    }

    if (moodLevel === null) {
      setError('Please select your mood')
      return
    }

    if (energyLevel === null) {
      setError('Please select your energy level')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, moodLevel, energyLevel, notes }),
      })
      if (res.ok) {
        setDate(getToday())
        setMoodLevel(null)
        setEnergyLevel(null)
        setNotes('')
        onSuccess()
      } else {
        setError('Failed to save mood entry')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full max-w-xs"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>How are you feeling?</Label>
              <div className="flex gap-2">
                {MOOD_LEVELS.map((level) => (
                  <button
                    key={level.level}
                    type="button"
                    onClick={() => setMoodLevel(level.level)}
                    className={cn(
                      'flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 text-xl transition-all hover:scale-105',
                      moodLevel === level.level
                        ? 'border-primary bg-primary/10'
                        : 'border-muted bg-card hover:border-muted-foreground/50'
                    )}
                    title={level.label}
                  >
                    {level.emoji}
                  </button>
                ))}
              </div>
              {moodLevel && (
                <p className="text-sm text-muted-foreground">
                  {MOOD_LEVELS.find((m) => m.level === moodLevel)?.label}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Energy level?</Label>
              <div className="flex gap-2">
                {ENERGY_LEVELS.map((level) => (
                  <button
                    key={level.level}
                    type="button"
                    onClick={() => setEnergyLevel(level.level)}
                    className={cn(
                      'flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 text-xl transition-all hover:scale-105',
                      energyLevel === level.level
                        ? 'border-primary bg-primary/10'
                        : 'border-muted bg-card hover:border-muted-foreground/50'
                    )}
                    title={level.label}
                  >
                    {level.emoji}
                  </button>
                ))}
              </div>
              {energyLevel && (
                <p className="text-sm text-muted-foreground">
                  {ENERGY_LEVELS.find((e) => e.level === energyLevel)?.label}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              placeholder="Any thoughts about your day..."
              rows={2}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
