/**
 * Authentication configuration using BetterAuth library
 */
import { type BetterAuthOptions, betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { createAuthMiddleware } from "better-auth/api"
import { customSession, genericOAuth } from "better-auth/plugins"

import { UserRole } from "@/lib/_generated/prisma"
import { hashPassword, verifyPasswordObject } from "@/lib/argon2"
import { env } from "@/lib/env"
import mergeCarts from "@/lib/helpers/merge-carts"
import mergeFavorites from "@/lib/helpers/merge-favorites"
import prisma from "@/lib/prisma"
import { normalizeName } from "@/lib/utils"

const IS_DEV = process.env.NODE_ENV !== "production"

function parseCsvEnv(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export const options = {
  appName: "co_chocolat_auth",
  onAPIError: {
    errorURL: "/error",
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    password: {
      hash: hashPassword,
      // BetterAuth (this version) expects (data: { hash; password })
      verify: verifyPasswordObject,
    },
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    },
  },

  advanced: {
    database: {
      generateId: false,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "USER"] as Array<UserRole>,
        input: false,
      },
      phone: {
        type: "string",
        input: false,
      },
      paymentMethod: {
        type: "string",
        input: false,
      },
    },
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 30 * 60,
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email" && ctx.body?.name) {
        const name = normalizeName(ctx.body.name)
        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        }
      }

      if (IS_DEV && ctx.path === "/sign-in/email") {
        try {
          const rawEmail = ctx.body?.email
          const normalized = rawEmail?.trim().toLowerCase()
          const user = normalized
            ? await prisma.user.findUnique({
                where: { email: normalized },
                include: { accounts: true },
              })
            : null
          console.log("[LOGIN-DEBUG]", {
            path: ctx.path,
            email: rawEmail,
            normalized,
            userFound: !!user,
            accounts: user?.accounts.map((a) => ({
              id: a.id,
              providerId: a.providerId,
              accountId: a.accountId,
              hasPassword: !!a.password,
              updatedAt: a.updatedAt,
            })),
          })
        } catch (e) {
          console.log("[LOGIN-DEBUG] error", e)
        }
      }
    }),

    after: createAuthMiddleware(async (ctx) => {
      const isAuthenticationEvent =
        ctx.path.startsWith("/sign-up") ||
        ctx.path.startsWith("/sign-in") ||
        ctx.path.includes("/callback") ||
        ctx.path.includes("/oauth") ||
        ctx.path.includes("/google") ||
        ctx.path.includes("/facebook") ||
        ctx.path.includes("/instagram")

      if (ctx.path === "/get-session" || !isAuthenticationEvent) return

      const session = ctx.context.session || ctx.context.newSession
      if (!session?.user?.id) {
        if (IS_DEV) {
          console.log("[AUTH] Auth path but no session", { path: ctx.path })
        }
        return
      }

      const userId = session.user.id
      try {
        const sessionFavoriteId = ctx.getCookie("sessionFavoriteId")
        const sessionCartId = ctx.getCookie("sessionCartId")

        if (sessionFavoriteId) {
          await mergeFavorites(userId, sessionFavoriteId)
        }
        if (sessionCartId) {
          await mergeCarts(userId, sessionCartId)
        }

        if (IS_DEV) {
          console.log("[AUTH] Merge complete", {
            userId,
            favoriteSession: sessionFavoriteId,
            cartSession: sessionCartId,
          })
        }
      } catch (error) {
        console.error("[AUTH] Merge error", {
          userId,
            path: ctx.path,
          error,
        })
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmails = parseCsvEnv(env.ADMIN_EMAIL)
          if (adminEmails.includes(user.email.toLowerCase())) {
            return { data: { ...user, role: UserRole.ADMIN } }
          }
          return { data: user }
        },
      },
    },
  },
} satisfies BetterAuthOptions

export const auth = betterAuth({
  ...options,
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "instagram",
          clientId: process.env.INSTAGRAM_CLIENT_ID as string,
          clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
          authorizationUrl: "https://api.instagram.com/oauth/authorize",
          tokenUrl: "https://api.instagram.com/oauth/access_token",
        },
      ],
    }),
    customSession(async ({ session, user }) => {
      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          createdAt: user.createdAt,
          role: user.role,
          phone: user.phone,
        },
      }
    }, options),
  ],
})

export type AuthErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN"