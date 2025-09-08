import {
  customSessionClient,
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import type { auth } from "@/lib/auth"
import { env } from "@/lib/env"

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
    genericOAuthClient(),
  ],
})

export const { signUp, signIn, signOut, useSession } = authClient

export type Session = typeof authClient.$Infer.Session
