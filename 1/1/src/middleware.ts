import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import handleSessionCookies from "@/lib/helpers/handle-session-cookies"

// IMPORTANT: Set this to the actual Better Auth session cookie name from your browser.
// Example guesses (pick the one that matches your environment):
// const SESSION_COOKIE_NAME = "better-auth.session"
// const SESSION_COOKIE_NAME = "better-auth.sessionToken"
const SESSION_COOKIE_NAME = "better-auth.session"  // <-- CHANGE IF DIFFERENT

const protectedRoutes = [
  "/dashboard",
  "/order-history",
  "/checkout/delivery",
  "/checkout/delivery/payment-method",
  "/checkout/delivery/place-order",
  "/account/change-password",
]

const authRoutes = ["/login", "/register"]

// Adjust if your Better Auth session endpoint differs.
const SESSION_VALIDATE_ENDPOINT = "/api/auth/get-session"

async function validateSession(req: NextRequest): Promise<boolean> {
  try {
    const url = new URL(SESSION_VALIDATE_ENDPOINT, req.url)
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    })
    if (!res.ok) return false
    const data = await res.json().catch(() => ({}))
    return !!data?.user?.id
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  // Base response (merges/normalizes session cookies, etc.)
  const baseResponse = handleSessionCookies(req)

  // Raw cookie value (string | undefined)
  const sessionCookieValue = getSessionCookie(req)
  const hasCookie = !!sessionCookieValue

  const isOnProtected = protectedRoutes.includes(pathname)
  const isOnAuthRoute = authRoutes.includes(pathname)

  let hasValidSession = false

  // Only validate if we actually have a cookie AND we're on a route where it matters
  if (hasCookie && (isOnProtected || isOnAuthRoute)) {
    hasValidSession = await validateSession(req)

    if (!hasValidSession) {
      // Stale cookie: remove it so user can access /login cleanly
      baseResponse.cookies.delete(SESSION_COOKIE_NAME)

      if (process.env.NODE_ENV !== "production") {
        console.log("[MIDDLEWARE] Stale session cookie cleared", {
          path: pathname,
          cookieName: SESSION_COOKIE_NAME,
        })
      }
    }
  }

  // Require auth: redirect unauthenticated users (no valid session)
  if (isOnProtected && !hasValidSession) {
    let callbackURL = pathname
    if (nextUrl.search) callbackURL += nextUrl.search
    const encoded = encodeURIComponent(callbackURL)
    return NextResponse.redirect(
      new URL(`/login?callbackURL=${encoded}`, req.url),
    )
  }

  // Block auth routes only if we CONFIRMED a valid session
  if (isOnAuthRoute && hasValidSession) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Diagnostics headers (safe to keep or remove)
  baseResponse.headers.set(
    "x-auth-state",
    hasValidSession ? "authenticated" : "unauthenticated",
  )
  baseResponse.headers.set("x-pathname", pathname)

  return baseResponse
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}

/**
 * OPTIONAL TEMP DEBUG (remove after confirming cookie name):
 *
 * Uncomment to log all cookie names once:
 *
 * if (process.env.NODE_ENV !== "production") {
 *   console.log("[MIDDLEWARE] Incoming cookies:", req.headers.get("cookie"))
 * }
 */