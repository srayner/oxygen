'use client'

import { useState, useEffect, useCallback } from 'react'
import { WeightForm } from './weight-form'
import { CsvImport } from './csv-import'
import { WeightChart } from './weight-chart'
import { WeightList } from './weight-list'

interface WeightEntry {
  id: string
  date: string
  weightKg: number
}

interface Preferences {
  weightUnit: 'kg' | 'imperial'
}

export type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all'

function getStartDate(range: TimeRange): string | undefined {
  if (range === 'all') return undefined
  const days = { '1m': 30, '3m': 90, '6m': 180, '1y': 365 }
  const date = new Date()
  date.setDate(date.getDate() - days[range])
  return date.toISOString().split('T')[0]
}

export function WeightTracker() {
  const [weights, setWeights] = useState<WeightEntry[]>([])
  const [preferences, setPreferences] = useState<Preferences>({
    weightUnit: 'kg',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('all')

  const fetchWeights = useCallback(async () => {
    const startDate = getStartDate(timeRange)
    const url = startDate
      ? `/api/weights?startDate=${startDate}`
      : '/api/weights'
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      setWeights(data)
    }
  }, [timeRange])

  const fetchPreferences = useCallback(async () => {
    const res = await fetch('/api/preferences')
    if (res.ok) {
      const data = await res.json()
      setPreferences({ weightUnit: data.weightUnit as 'kg' | 'imperial' })
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchWeights(), fetchPreferences()]).finally(() => {
      setIsLoading(false)
    })
  }, [fetchWeights, fetchPreferences])

  const handleToggleUnit = async () => {
    const newUnit = preferences.weightUnit === 'kg' ? 'imperial' : 'kg'
    setPreferences({ weightUnit: newUnit })
    await fetch('/api/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weightUnit: newUnit }),
    })
  }

  const handleDelete = (id: string) => {
    setWeights((prev) => prev.filter((w) => w.id !== id))
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
      <WeightForm
        onSuccess={fetchWeights}
        defaultUnit={preferences.weightUnit}
      />
      <WeightChart
        weights={weights}
        displayUnit={preferences.weightUnit}
        onToggleUnit={handleToggleUnit}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
      <CsvImport
        onSuccess={fetchWeights}
        displayUnit={preferences.weightUnit}
      />
      <WeightList
        weights={weights}
        displayUnit={preferences.weightUnit}
        onDelete={handleDelete}
      />
    </div>
  )
}
