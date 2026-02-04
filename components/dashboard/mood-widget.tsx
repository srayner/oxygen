'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getMoodEmoji,
  getMoodLabel,
  getEnergyEmoji,
  getEnergyLabel,
  calculateAverage,
  getTrend,
} from '@/lib/mood-utils'

interface MoodEntry {
  id: string
  date: string
  moodLevel: number
  energyLevel: number
  notes?: string | null
}

export function MoodWidget() {
  const [moods, setMoods] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMoods = async () => {
      const date = new Date()
      date.setDate(date.getDate() - 14)
      const startDate = date.toISOString().split('T')[0]
      const res = await fetch(`/api/mood?startDate=${startDate}`)
      if (res.ok) {
        const data = await res.json()
        setMoods(data)
      }
      setIsLoading(false)
    }
    fetchMoods()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const fourteenDaysAgo = new Date(today)
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  const thisWeekEntries = moods.filter((m) => {
    const date = new Date(m.date)
    return date >= sevenDaysAgo
  })

  const lastWeekEntries = moods.filter((m) => {
    const date = new Date(m.date)
    return date >= fourteenDaysAgo && date < sevenDaysAgo
  })

  const latestEntry =
    moods.length > 0
      ? moods.reduce((latest, m) =>
          new Date(m.date) > new Date(latest.date) ? m : latest
        )
      : null

  const moodAvg = calculateAverage(thisWeekEntries, 'moodLevel')
  const energyAvg = calculateAverage(thisWeekEntries, 'energyLevel')
  const moodTrend = getTrend(thisWeekEntries, lastWeekEntries, 'moodLevel')
  const energyTrend = getTrend(thisWeekEntries, lastWeekEntries, 'energyLevel')

  const TrendIcon = ({ direction }: { direction: 'up' | 'down' | 'same' }) => {
    if (direction === 'up')
      return <TrendingUp className="h-4 w-4 text-green-500" />
    if (direction === 'down')
      return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mood</span>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mood">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>Your mood and energy tracker</CardDescription>
      </CardHeader>
      <CardContent>
        {moods.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No entries yet</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="/mood">Log your first mood</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {latestEntry && (
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <span className="text-3xl">
                    {getMoodEmoji(latestEntry.moodLevel)}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {getMoodLabel(latestEntry.moodLevel)}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-3xl">
                    {getEnergyEmoji(latestEntry.energyLevel)}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {getEnergyLabel(latestEntry.energyLevel)}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">7-day mood avg</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {moodAvg !== null ? moodAvg.toFixed(1) : '-'}
                  </span>
                  {moodTrend && <TrendIcon direction={moodTrend.direction} />}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">7-day energy avg</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {energyAvg !== null ? energyAvg.toFixed(1) : '-'}
                  </span>
                  {energyTrend && (
                    <TrendIcon direction={energyTrend.direction} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
