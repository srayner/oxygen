import { auth } from '@/lib/auth'
import { PageHeader } from '@/components/layout/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome to your dashboard overview"
      />
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>You are signed in as</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-medium">{session?.user?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.email}
                </p>
                <Badge variant="secondary" className="capitalize">
                  {session?.user?.role}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projects</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tasks</span>
                  <span className="font-medium">48</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">36</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  No recent activity to display.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
