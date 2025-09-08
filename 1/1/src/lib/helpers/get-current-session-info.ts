import { cookies, headers } from "next/headers"
import { cache } from "react"

import { auth } from "@/lib/auth"

const getCurrentSessionInfo = cache(async () => {
  const [cookiesResult, authSession] = await Promise.all([
    cookies(),
    auth.api.getSession({
      headers: await headers(),
    }),
  ])

  const sessionCartId = cookiesResult.get("sessionCartId")?.value
  const sessionFavoriteId = cookiesResult.get("sessionFavoriteId")?.value
  const userId = authSession?.user?.id

  return {
    sessionCartId,
    sessionFavoriteId,
    userId,
  }
})

export default getCurrentSessionInfo
