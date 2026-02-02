import { SessionProvider } from '@/components/providers/session-provider'
import { AppShell } from '@/components/layout/app-shell'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  )
}
