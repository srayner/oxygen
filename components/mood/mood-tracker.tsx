'use client'

import { useState, useEffect, useCallback } from 'react'
import { MoodForm } from './mood-form'
import { MoodChart } from './mood-chart'
import { MoodList } from './mood-list'

interface MoodEntry {
  id: string
  date: string
  moodLevel: number
  energyLevel: number
  notes?: string | null
}

export type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all'

function getStartDate(range: TimeRange): string | undefined {
  if (range === 'all') return undefined
  const days = { '1m': 30, '3m': 90, '6m': 180, '1y': 365 }
  const date = new Date()
  date.setDate(date.getDate() - days[range])
  return date.toISOString().split('T')[0]
}

export function MoodTracker() {
  const [moods, setMoods] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('all')

  const fetchMoods = useCallback(async () => {
    const startDate = getStartDate(timeRange)
    const url = startDate ? `/api/mood?startDate=${startDate}` : '/api/mood'
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      setMoods(data)
    }
  }, [timeRange])

  useEffect(() => {
    fetchMoods().finally(() => {
      setIsLoading(false)
    })
  }, [fetchMoods])

  const handleDelete = (id: string) => {
    setMoods((prev) => prev.filter((m) => m.id !== id))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-lg border bg-card" />
        <div className="h-80 animate-pulse rounded-lg border bg-card" />
        <div className="h-48 animate-pulse rounded-lg border bg-card" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MoodForm onSuccess={fetchMoods} />
      <MoodChart
        moods={moods}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
      <MoodList moods={moods} onDelete={handleDelete} />
    </div>
  )
}
