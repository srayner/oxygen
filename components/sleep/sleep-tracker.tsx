'use client'

import { useState, useEffect, useCallback } from 'react'
import { SleepForm } from './sleep-form'
import { SleepChart } from './sleep-chart'
import { SleepList } from './sleep-list'

interface SleepEntry {
  id: string
  date: string
  bedtime: string
  waketime: string
  durationMins: number
}

export type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all'

function getStartDate(range: TimeRange): string | undefined {
  if (range === 'all') return undefined
  const days = { '1m': 30, '3m': 90, '6m': 180, '1y': 365 }
  const date = new Date()
  date.setDate(date.getDate() - days[range])
  return date.toISOString().split('T')[0]
}

export function SleepTracker() {
  const [sleeps, setSleeps] = useState<SleepEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('all')

  const fetchSleeps = useCallback(async () => {
    const startDate = getStartDate(timeRange)
    const url = startDate ? `/api/sleep?startDate=${startDate}` : '/api/sleep'
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      setSleeps(data)
    }
  }, [timeRange])

  useEffect(() => {
    fetchSleeps().finally(() => {
      setIsLoading(false)
    })
  }, [fetchSleeps])

  const handleDelete = (id: string) => {
    setSleeps((prev) => prev.filter((s) => s.id !== id))
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
      <SleepForm onSuccess={fetchSleeps} />
      <SleepChart
        sleeps={sleeps}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
      <SleepList sleeps={sleeps} onDelete={handleDelete} />
    </div>
  )
}
