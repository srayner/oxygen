import { auth } from '@/lib/auth'
import { PageHeader } from '@/components/layout/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account preferences"
      />
      <div className="p-6">
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={session?.user?.name || ''}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={session?.user?.email || ''}
                  disabled
                />
              </div>
              <Button disabled>Save Changes</Button>
              <p className="text-xs text-muted-foreground">
                Profile editing is not implemented in this skeleton.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Role</Label>
                <p className="text-sm capitalize text-muted-foreground">
                  {session?.user?.role}
                </p>
              </div>
              <Separator />
              <div>
                <Label>User ID</Label>
                <p className="font-mono text-sm text-muted-foreground">
                  {session?.user?.id}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Account deletion is not implemented in this skeleton.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
