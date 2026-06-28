import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { SvixAdmin } from '@srayner02/svix-admin'
import { eventTypes } from './events.config'

export default async function WebhooksPage() {
  const session = await auth()
  if (session?.user?.role !== 'admin') redirect('/dashboard')

  return (
    <div>
      <PageHeader
        title="Webhooks"
        description="Manage webhook endpoints, view delivery logs, and replay messages."
      />
      <div className="p-6">
        <SvixAdmin appName="Oxygen" eventTypes={eventTypes} />
      </div>
    </div>
  )
}
