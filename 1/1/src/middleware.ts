import { NextRequest, NextResponse } from "next/server"

import { getSessionCookie } from "better-auth/cookies"

import handleSessionCookies from "@/lib/helpers/handle-session-cookies"

const protectedRoutes = [
  "/dashboard",
  "/order-history",
  "/checkout/delivery",
  "/checkout/delivery/payment-method",
  "/checkout/delivery/place-order",
]
const authRoutes = ["/login", "/register"]

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  const sessionCookie = getSessionCookie(req)

  const isLoggedIn = !!sessionCookie
  const isOnProtectedRoute = protectedRoutes.includes(nextUrl.pathname)
  const isOnAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isOnProtectedRoute && !isLoggedIn) {
    let callbackURL = nextUrl.pathname
    if (nextUrl.search) {
      callbackURL += nextUrl.search
    }
    const encodedCallbackURL = encodeURIComponent(callbackURL)
    return NextResponse.redirect(
      new URL(`/login?callbackURL=${encodedCallbackURL}`, req.url),
    )
  }

  if (isOnAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Create response with pathname header for checkout layout
  const response = handleSessionCookies(req)
  response.headers.set("x-pathname", nextUrl.pathname)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
