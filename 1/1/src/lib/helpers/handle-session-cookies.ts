import { NextRequest, NextResponse } from "next/server"

/**
 * Handles setting up shopping session cookies if they don't exist
 */
export default function handleSessionCookies(req: NextRequest): NextResponse {
  // Check for required cookies
  const requiredCookies = [
    { name: "sessionCartId", exists: !!req.cookies.get("sessionCartId") },
    {
      name: "sessionFavoriteId",
      exists: !!req.cookies.get("sessionFavoriteId"),
    },
  ]

  const { nextUrl, headers } = req

  headers.set("x-pathname", nextUrl.pathname)
  headers.set("x-url", req.url)

  const response = NextResponse.next({
    request: {
      headers,
    },
  })

  // If all cookies exist, continue without modifications
  if (requiredCookies.every((cookie) => cookie.exists)) {
    return response
  }

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  }

  // Set any missing cookies
  requiredCookies.forEach((cookie) => {
    if (!cookie.exists) {
      const sessionId = crypto.randomUUID()
      response.cookies.set(cookie.name, sessionId, cookieOptions)
    }
  })

  return response
}
