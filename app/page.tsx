import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-semibold">Next Skeleton</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Production-Ready
            <br />
            <span className="text-muted-foreground">Next.js Starter</span>
          </h1>
          <p className="max-w-[600px] text-lg text-muted-foreground">
            A complete starter template with authentication, role-based
            authorization, and a professional admin dashboard layout. Built with
            Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/40">
          <div className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold">Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Secure credentials-based authentication with NextAuth v5,
                including login, registration, and session management.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground">
                Built-in user roles with middleware protection. Admin and user
                roles with protected routes out of the box.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Modern Stack</h3>
              <p className="text-sm text-muted-foreground">
                Built with Next.js 14 App Router, TypeScript, Tailwind CSS,
                shadcn/ui components, and Prisma ORM.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto flex items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">
            Next Skeleton - A production-ready starter template
          </p>
        </div>
      </footer>
    </div>
  )
}
