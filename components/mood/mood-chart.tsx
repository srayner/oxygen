'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { getMoodEmoji, getEnergyEmoji } from '@/lib/mood-utils'
import type { TimeRange } from './mood-tracker'

interface MoodEntry {
  id: string
  date: string
  moodLevel: number
  energyLevel: number
  notes?: string | null
}

interface MoodChartProps {
  moods: MoodEntry[]
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
}

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  '1m': '1 month',
  '3m': '3 months',
  '6m': '6 months',
  '1y': '1 year',
  all: 'All time',
}

interface ChartDataPoint {
  date: string
  timestamp: number
  fullDate: string
  moodLevel: number | null
  energyLevel: number | null
  moodEmoji: string
  energyEmoji: string
}

export function MoodChart({
  moods,
  timeRange,
  onTimeRangeChange,
}: MoodChartProps) {
  const sortedMoods = moods
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartData: ChartDataPoint[] = []
  const GAP_THRESHOLD_DAYS = 7

  sortedMoods.forEach((m, index) => {
    const date = new Date(m.date)
    const timestamp = date.getTime()

    if (index > 0) {
      const prevDate = new Date(sortedMoods[index - 1].date)
      const daysDiff = (timestamp - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysDiff > GAP_THRESHOLD_DAYS) {
        const midTimestamp =
          prevDate.getTime() + (timestamp - prevDate.getTime()) / 2
        chartData.push({
          date: '',
          timestamp: midTimestamp,
          fullDate: '',
          moodLevel: null,
          energyLevel: null,
          moodEmoji: '',
          energyEmoji: '',
        })
      }
    }

    chartData.push({
      date: date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
      timestamp,
      fullDate: m.date,
      moodLevel: m.moodLevel,
      energyLevel: m.energyLevel,
      moodEmoji: getMoodEmoji(m.moodLevel),
      energyEmoji: getEnergyEmoji(m.energyLevel),
    })
  })

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: ChartDataPoint }>
  }) => {
    if (
      active &&
      payload &&
      payload.length &&
      payload[0].payload.moodLevel !== null
    ) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-card p-2 shadow-sm">
          <p className="text-sm text-muted-foreground">{data.date}</p>
          <p className="text-sm">
            <span className="font-medium">Mood:</span> {data.moodEmoji}{' '}
            {data.moodLevel}/5
          </p>
          <p className="text-sm">
            <span className="font-medium">Energy:</span> {data.energyEmoji}{' '}
            {data.energyLevel}/5
          </p>
        </div>
      )
    }
    return null
  }

  const EmojiTick = (props: {
    x?: string | number
    y?: string | number
    payload?: { value: number }
  }) => {
    const { x, y, payload } = props
    if (x === undefined || y === undefined || !payload) return null
    const moodEmoji = getMoodEmoji(payload.value)
    return (
      <text x={x} y={y} dy={4} textAnchor="end" fontSize={14}>
        {moodEmoji}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mood & Energy Trend</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {TIME_RANGE_LABELS[timeRange]}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={timeRange}
                onValueChange={(value) => onTimeRangeChange(value as TimeRange)}
              >
                <DropdownMenuRadioItem value="1m">
                  1 month
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3m">
                  3 months
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="6m">
                  6 months
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="1y">1 year</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="all">
                  All time
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No mood entries yet. Add your first entry above.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(ts) => {
                  const date = new Date(ts)
                  return date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })
                }}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={EmojiTick}
                className="text-xs"
              />
              <Tooltip content={<CustomTooltip />} filterNull={true} />
              <Legend />
              <Line
                type="monotone"
                dataKey="moodLevel"
                name="Mood"
                stroke="hsl(var(--chart-line))"
                strokeWidth={2}
                dot={{
                  fill: 'hsl(var(--chart-line))',
                  stroke: 'hsl(var(--chart-line))',
                  strokeWidth: 2,
                  r: 3,
                }}
                activeDot={{ r: 5, fill: 'hsl(var(--chart-line))' }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="energyLevel"
                name="Energy"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{
                  fill: 'hsl(var(--chart-2))',
                  stroke: 'hsl(var(--chart-2))',
                  strokeWidth: 2,
                  r: 3,
                }}
                activeDot={{ r: 5, fill: 'hsl(var(--chart-2))' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
