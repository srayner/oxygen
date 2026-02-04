export interface MoodLevel {
  level: number
  emoji: string
  label: string
}

export interface EnergyLevel {
  level: number
  emoji: string
  label: string
}

export const MOOD_LEVELS: MoodLevel[] = [
  { level: 1, emoji: '😩', label: 'Awful' },
  { level: 2, emoji: '🙁', label: 'Bad' },
  { level: 3, emoji: '😐', label: 'Okay' },
  { level: 4, emoji: '🙂', label: 'Good' },
  { level: 5, emoji: '😊', label: 'Great' },
]

export const ENERGY_LEVELS: EnergyLevel[] = [
  { level: 1, emoji: '😴', label: 'Exhausted' },
  { level: 2, emoji: '🥱', label: 'Tired' },
  { level: 3, emoji: '😶', label: 'Neutral' },
  { level: 4, emoji: '🙂', label: 'Energized' },
  { level: 5, emoji: '⚡', label: 'Supercharged' },
]

export function getMoodEmoji(level: number): string {
  return MOOD_LEVELS.find((m) => m.level === level)?.emoji ?? '😐'
}

export function getMoodLabel(level: number): string {
  return MOOD_LEVELS.find((m) => m.level === level)?.label ?? 'Unknown'
}

export function getEnergyEmoji(level: number): string {
  return ENERGY_LEVELS.find((e) => e.level === level)?.emoji ?? '😶'
}

export function getEnergyLabel(level: number): string {
  return ENERGY_LEVELS.find((e) => e.level === level)?.label ?? 'Unknown'
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function calculateAverage(
  entries: { moodLevel: number; energyLevel: number }[],
  field: 'moodLevel' | 'energyLevel'
): number | null {
  if (entries.length === 0) return null
  const sum = entries.reduce((acc, entry) => acc + entry[field], 0)
  return Math.round((sum / entries.length) * 10) / 10
}

export function getTrend(
  thisWeekEntries: { moodLevel: number; energyLevel: number }[],
  lastWeekEntries: { moodLevel: number; energyLevel: number }[],
  field: 'moodLevel' | 'energyLevel'
): { direction: 'up' | 'down' | 'same'; change: number } | null {
  const thisWeekAvg = calculateAverage(thisWeekEntries, field)
  const lastWeekAvg = calculateAverage(lastWeekEntries, field)

  if (thisWeekAvg === null || lastWeekAvg === null) return null

  const change = Math.round((thisWeekAvg - lastWeekAvg) * 10) / 10

  if (change > 0) return { direction: 'up', change }
  if (change < 0) return { direction: 'down', change: Math.abs(change) }
  return { direction: 'same', change: 0 }
}
