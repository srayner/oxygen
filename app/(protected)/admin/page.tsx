import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminPage() {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div>
      <PageHeader
        title="Admin Panel"
        description="Administrative controls and settings"
      />
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Database</span>
                  <Badge variant="default">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Auth Service</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">API</span>
                  <Badge variant="default">Healthy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>Overview of user data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Users</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Admins</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Regular Users</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Administrative tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Admin actions are not implemented in this skeleton. This page
                demonstrates role-based access control.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
