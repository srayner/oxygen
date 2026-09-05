import { PageHeader } from '@/components/layout/page-header'
import { DiaryTracker } from '@/components/diary/diary-tracker'

export default function DiaryPage() {
  return (
    <div>
      <PageHeader
        title="Diary"
        description="Log your thoughts and what you did each day"
      />
      <div className="p-6">
        <DiaryTracker />
      </div>
    </div>
  )
}
