import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const publicRoutes = ['/', '/login', '/register']
const adminRoutes = ['/admin']

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname)
  const isAuthRoute =
    nextUrl.pathname === '/login' || nextUrl.pathname === '/register'

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (isAdminRoute && isLoggedIn) {
    const userRole = req.auth?.user?.role
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
