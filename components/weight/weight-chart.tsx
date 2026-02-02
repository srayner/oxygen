'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
import { formatWeight, kgToStonesAndLbs } from '@/lib/weight-utils'
import type { TimeRange } from './weight-tracker'

interface WeightEntry {
  id: string
  date: string
  weightKg: number
}

interface WeightChartProps {
  weights: WeightEntry[]
  displayUnit: 'kg' | 'imperial'
  onToggleUnit: () => void
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
  weightKg: number
  displayValue: number | null
  formattedWeight: string
}

export function WeightChart({
  weights,
  displayUnit,
  onToggleUnit,
  timeRange,
  onTimeRangeChange,
}: WeightChartProps) {
  const sortedWeights = weights
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Build chart data with gap detection (gaps > 7 days create a break in the line)
  const chartData: ChartDataPoint[] = []
  const GAP_THRESHOLD_DAYS = 7

  sortedWeights.forEach((w, index) => {
    const date = new Date(w.date)
    const timestamp = date.getTime()

    // Check if there's a gap from previous entry
    if (index > 0) {
      const prevDate = new Date(sortedWeights[index - 1].date)
      const daysDiff = (timestamp - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      // Insert a null point to create a gap in the line
      if (daysDiff > GAP_THRESHOLD_DAYS) {
        const midTimestamp =
          prevDate.getTime() + (timestamp - prevDate.getTime()) / 2
        chartData.push({
          date: '',
          timestamp: midTimestamp,
          fullDate: '',
          weightKg: 0,
          displayValue: null,
          formattedWeight: '',
        })
      }
    }

    chartData.push({
      date: date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
      timestamp,
      fullDate: w.date,
      weightKg: w.weightKg,
      displayValue:
        displayUnit === 'kg'
          ? w.weightKg
          : kgToStonesAndLbs(w.weightKg).stones +
            kgToStonesAndLbs(w.weightKg).lbs / 14,
      formattedWeight: formatWeight(w.weightKg, displayUnit),
    })
  })

  const formatYAxis = (value: number) => {
    if (displayUnit === 'kg') {
      return `${value.toFixed(0)}`
    }
    const stones = Math.floor(value)
    const lbs = Math.round((value - stones) * 14)
    return `${stones}st ${lbs}`
  }

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
      payload[0].payload.displayValue !== null
    ) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-card p-2 shadow-sm">
          <p className="text-sm text-muted-foreground">{data.date}</p>
          <p className="text-sm font-medium">{data.formattedWeight}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weight Trend</span>
          <div className="flex items-center gap-2">
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
                  onValueChange={(value) =>
                    onTimeRangeChange(value as TimeRange)
                  }
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
                  <DropdownMenuRadioItem value="1y">
                    1 year
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="all">
                    All time
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={onToggleUnit}>
              Show in {displayUnit === 'kg' ? 'st/lbs' : 'kg'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No weight entries yet. Add your first entry above.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={formatYAxis}
                domain={['auto', 'auto']}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} filterNull={true} />
              <Area
                type="monotone"
                dataKey="displayValue"
                stroke="hsl(var(--chart-line))"
                strokeWidth={2}
                fill="url(#weightGradient)"
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
