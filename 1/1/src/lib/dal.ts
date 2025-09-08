import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

import "server-only"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const verifySession = cache(async (options?: { isAdmin?: boolean }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    const headersList = await headers()
    const pathname =
      headersList.get("x-pathname") || headersList.get("x-url") || ""

    // Create the absolute URL or just use the pathname
    const currentPath = pathname.startsWith("/") ? pathname : `/${pathname}`
    const callbackURL = encodeURIComponent(currentPath)

    redirect(`/login?callbackURL=${callbackURL}`)
  }

  // Check for admin role if isAdmin option is true
  if (options?.isAdmin && session?.user.role !== "ADMIN") {
    redirect("/")
  }

  // Get complete user data from database
  const fullUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      addresses: true,
      paymentMethod: true,
      role: true,
      image: true,
      createdAt: true,
    },
  })

  if (!fullUser) {
    redirect(`/login`)
  }

  // 🔥 SECURITY: Double-check admin role against database for admin routes
  // This prevents users who had their role changed from accessing admin areas
  // even if their session still shows the old role
  if (options?.isAdmin && fullUser.role !== "ADMIN") {
    console.log(
      `🔒 Security: User ${fullUser.id} blocked from admin access - role in DB is ${fullUser.role}`,
    )
    redirect("/")
  }

  return { isAuth: true, user: { ...session.user, ...fullUser } }
})

/**
 * Get current user info for form pre-filling
 */
export const getCurrentUserInfo = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return null
    }

    // Get complete user data from database
    const fullUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        addresses: true,
        paymentMethod: true,
        role: true,
        image: true,
        createdAt: true,
      },
    })

    if (!fullUser) {
      return null
    }

    return {
      ...session.user,
      ...fullUser,
    }
  } catch (error) {
    console.error("Error getting current user info:", error)
    return null
  }
})
