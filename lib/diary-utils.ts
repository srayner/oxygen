export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatEntryDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
