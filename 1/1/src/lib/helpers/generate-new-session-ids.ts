import { cookies } from "next/headers"

/**
 * Generates new session IDs for cart and favorites
 * Used when users sign in/out to create fresh sessions
 */
export default async function generateNewSessionIds() {
  const newSessionCartId = crypto.randomUUID()
  const newSessionFavoriteId = crypto.randomUUID()

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  }

  const cookieStore = await cookies()
  cookieStore.set("sessionCartId", newSessionCartId, cookieOptions)
  cookieStore.set("sessionFavoriteId", newSessionFavoriteId, cookieOptions)

  return { newSessionCartId, newSessionFavoriteId }
}

/**
 * Generates a new session cart ID
 * Used to create a fresh cart session
 */
export async function generateNewSessionCartId() {
  const newSessionCartId = crypto.randomUUID()

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  }

  const cookieStore = await cookies()
  cookieStore.set("sessionCartId", newSessionCartId, cookieOptions)

  return { newSessionCartId }
}
