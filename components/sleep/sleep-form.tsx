'use client'

import { useState, FormEvent, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getYesterday,
  calculateDurationMins,
  formatDuration,
} from '@/lib/sleep-utils'

interface SleepFormProps {
  onSuccess: () => void
}

export function SleepForm({ onSuccess }: SleepFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState(getYesterday())
  const [bedtime, setBedtime] = useState('22:00')
  const [waketime, setWaketime] = useState('07:00')

  const duration = useMemo(() => {
    if (!bedtime || !waketime) return null
    const mins = calculateDurationMins(bedtime, waketime)
    return formatDuration(mins)
  }, [bedtime, waketime])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!date) {
      setError('Date is required')
      return
    }

    if (!bedtime || !waketime) {
      setError('Both bedtime and wake time are required')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/sleep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, bedtime, waketime }),
      })
      if (res.ok) {
        setDate(getYesterday())
        setBedtime('22:00')
        setWaketime('07:00')
        onSuccess()
      } else {
        setError('Failed to save sleep entry')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Sleep</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="date">Sleep Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedtime">Bedtime</Label>
              <Input
                id="bedtime"
                name="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waketime">Wake Time</Label>
              <Input
                id="waketime"
                name="waketime"
                type="time"
                value={waketime}
                onChange={(e) => setWaketime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm">
                {duration || '-'}
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
