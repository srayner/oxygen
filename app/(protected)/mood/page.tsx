import { PageHeader } from '@/components/layout/page-header'
import { MoodTracker } from '@/components/mood/mood-tracker'

export default function MoodPage() {
  return (
    <div>
      <PageHeader
        title="Mood Tracker"
        description="Track your mood and energy levels over time"
      />
      <div className="p-6">
        <MoodTracker />
      </div>
    </div>
  )
}
