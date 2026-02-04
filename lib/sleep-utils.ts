/**
 * Calculate sleep duration in minutes from bedtime and waketime.
 * Handles overnight sleep (e.g., 23:00 to 07:00).
 */
export function calculateDurationMins(
  bedtime: string,
  waketime: string
): number {
  const [bedHours, bedMins] = bedtime.split(':').map(Number)
  const [wakeHours, wakeMins] = waketime.split(':').map(Number)

  const bedTotalMins = bedHours * 60 + bedMins
  let wakeTotalMins = wakeHours * 60 + wakeMins

  // If wake time is earlier than bedtime, it's the next day
  if (wakeTotalMins <= bedTotalMins) {
    wakeTotalMins += 24 * 60
  }

  return wakeTotalMins - bedTotalMins
}

/**
 * Format duration in minutes to "Xh Ym" format.
 */
export function formatDuration(mins: number): string {
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60
  if (minutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${minutes}m`
}

/**
 * Format time string (HH:mm) to 12-hour format with AM/PM.
 */
export function formatTime(time: string): string {
  const [hours, mins] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
}

/**
 * Get yesterday's date as YYYY-MM-DD string.
 */
export function getYesterday(): string {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

/**
 * Convert duration in minutes to hours (for chart display).
 */
export function durationToHours(mins: number): number {
  return Math.round((mins / 60) * 10) / 10
}
