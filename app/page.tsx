import Link from 'next/link'
import { Button } from '@/components/ui/button'

function HeartPulseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  )
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  )
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  )
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <HeartPulseIcon className="h-5 w-5" />
            </div>
            <span className="font-semibold">Oxygen</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/10">
            <HeartPulseIcon className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your Health Journey
            <br />
            <span className="text-emerald-600">Starts Here</span>
          </h1>
          <p className="max-w-[600px] text-lg text-muted-foreground">
            Track your weight, monitor your progress, and build healthy habits.
            Oxygen helps you take control of your wellbeing with simple,
            intuitive tracking tools.
          </p>
          <div className="flex gap-4">
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Link href="/register">Start Tracking</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/40">
          <div className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10">
                <ScaleIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold">Weight Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Log your weight daily and visualize your progress over time with
                beautiful charts and insights.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10">
                <TrendingUpIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold">Progress Insights</h3>
              <p className="text-sm text-muted-foreground">
                See trends in your data, track milestones, and celebrate your
                achievements along the way.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10">
                <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold">Private & Secure</h3>
              <p className="text-sm text-muted-foreground">
                Your health data stays yours. We use industry-standard security
                to keep your information safe.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Ready to feel your best?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join Oxygen today and take the first step toward a healthier you.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto flex items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">
            Oxygen - Your personal health and wellbeing companion
          </p>
        </div>
      </footer>
    </div>
  )
}
