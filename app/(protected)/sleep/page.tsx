import { PageHeader } from '@/components/layout/page-header'
import { SleepTracker } from '@/components/sleep/sleep-tracker'

export default function SleepPage() {
  return (
    <div>
      <PageHeader
        title="Sleep Tracker"
        description="Track your sleep patterns over time"
      />
      <div className="p-6">
        <SleepTracker />
      </div>
    </div>
  )
}
