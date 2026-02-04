'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
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
import { formatDuration, formatTime, durationToHours } from '@/lib/sleep-utils'
import type { TimeRange } from './sleep-tracker'

interface SleepEntry {
  id: string
  date: string
  bedtime: string
  waketime: string
  durationMins: number
}

interface SleepChartProps {
  sleeps: SleepEntry[]
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
  durationMins: number
  durationHours: number | null
  bedtime: string
  waketime: string
  formattedDuration: string
}

export function SleepChart({
  sleeps,
  timeRange,
  onTimeRangeChange,
}: SleepChartProps) {
  const sortedSleeps = sleeps
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartData: ChartDataPoint[] = []
  const GAP_THRESHOLD_DAYS = 7

  sortedSleeps.forEach((s, index) => {
    const date = new Date(s.date)
    const timestamp = date.getTime()

    if (index > 0) {
      const prevDate = new Date(sortedSleeps[index - 1].date)
      const daysDiff = (timestamp - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysDiff > GAP_THRESHOLD_DAYS) {
        const midTimestamp =
          prevDate.getTime() + (timestamp - prevDate.getTime()) / 2
        chartData.push({
          date: '',
          timestamp: midTimestamp,
          fullDate: '',
          durationMins: 0,
          durationHours: null,
          bedtime: '',
          waketime: '',
          formattedDuration: '',
        })
      }
    }

    chartData.push({
      date: date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
      timestamp,
      fullDate: s.date,
      durationMins: s.durationMins,
      durationHours: durationToHours(s.durationMins),
      bedtime: s.bedtime,
      waketime: s.waketime,
      formattedDuration: formatDuration(s.durationMins),
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
      payload[0].payload.durationHours !== null
    ) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-card p-2 shadow-sm">
          <p className="text-sm text-muted-foreground">{data.date}</p>
          <p className="text-sm font-medium">{data.formattedDuration}</p>
          <p className="text-xs text-muted-foreground">
            {formatTime(data.bedtime)} - {formatTime(data.waketime)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Sleep Trend</span>
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
            No sleep entries yet. Add your first entry above.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--chart-line-fill))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--chart-line-fill))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
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
                domain={[0, 12]}
                tickFormatter={(value) => `${value}h`}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} filterNull={true} />
              <ReferenceLine
                y={8}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                label={{
                  value: '8h recommended',
                  position: 'insideTopRight',
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="durationHours"
                stroke="hsl(var(--chart-line))"
                strokeWidth={2}
                fill="url(#sleepGradient)"
                dot={{
                  fill: 'hsl(var(--chart-line))',
                  stroke: 'hsl(var(--chart-line))',
                  strokeWidth: 2,
                  r: 3,
                }}
                activeDot={{ r: 5, fill: 'hsl(var(--chart-line))' }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
