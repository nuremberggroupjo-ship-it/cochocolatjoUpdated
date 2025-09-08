/**
 * Authentication configuration using BetterAuth library
 * This file sets up the authentication system for the Co Chocolat application
 */
import { type BetterAuthOptions, betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { createAuthMiddleware } from "better-auth/api"
import { customSession, genericOAuth } from "better-auth/plugins"

import { UserRole } from "@/lib/_generated/prisma"
import { hashPassword, verifyPassword } from "@/lib/argon2"
import { env } from "@/lib/env"
import mergeCarts from "@/lib/helpers/merge-carts"
import mergeFavorites from "@/lib/helpers/merge-favorites"
import prisma from "@/lib/prisma"
import { normalizeName } from "@/lib/utils"

/**
 * Authentication configuration options
 * This object defines all settings for the authentication system
 */
export const options = {
  // Application name for the auth system
  appName: "co_chocolat_auth",
  onAPIError: {
    errorURL: "/error",
  },
  // Database configuration using Prisma adapter
  database: prismaAdapter(prisma, {
    provider: "postgresql", // Specifies the database provider
  }),

  /**
   * Email and password authentication configuration
   * Defines settings for traditional email/password login
   */
  emailAndPassword: {
    enabled: true, // Enable email/password authentication
    minPasswordLength: 6, // Minimum password length
    password: {
      hash: hashPassword, // Function to hash passwords
      verify: verifyPassword, // Function to verify passwords
    },
  },

  /**
   * Social provider configuration
   * Settings for third-party authentication providers
   */
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID, // Google OAuth client ID
      clientSecret: env.GOOGLE_CLIENT_SECRET, // Google OAuth client secret
    },
    facebook: {
      clientId: env.FACEBOOK_CLIENT_ID, // Facebook OAuth client ID
      clientSecret: env.FACEBOOK_CLIENT_SECRET, // Facebook OAuth client secret
    },
  },

  /**
   * Advanced configuration options
   * Fine-tuning of auth behavior
   */
  advanced: {
    database: {
      generateId: false, // Don't auto-generate IDs (let Prisma handle it)
    },
  },

  /**
   * User configuration
   * Defines additional fields and properties for user entities
   */
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "USER"] as Array<UserRole>, // Define allowed user roles
        input: false, // Don't allow this field in signup forms
      },
      phone: {
        type: "string", // Phone number field
        input: false, // Allow this field in signup forms
      },
      paymentMethod: {
        type: "string", // Payment method field
        input: false, // Don't allow this field in signup forms
      },
    },
  },

  /**
   * Session configuration
   * Settings for user sessions
   */
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
    cookieCache: {
      enabled: true, // Enable cookie caching for sessions
      maxAge: 30 * 60, // Cache for 30 minutes
    },
  },

  /**
   * Request lifecycle hooks
   * Functions that run during authentication request lifecycle
   */
  hooks: {
    // Runs before authentication requests are processed
    before: createAuthMiddleware(async (ctx) => {
      // Handle email signup specifically
      if (ctx.path === "/sign-up/email") {
        // Normalize the user's name before saving it to the database
        // This removes special characters and formats the name properly
        const name = normalizeName(ctx.body.name)

        // Return modified context with normalized name
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
    }),

    // 🔥 NEW: Handle favorite and cart merging and cleanup
    after: createAuthMiddleware(async (ctx) => {
      // Helper function to handle favorite and cart merging
      const handleMerging = async (userId: string) => {
        try {
          const sessionFavoriteId = ctx.getCookie("sessionFavoriteId")
          const sessionCartId = ctx.getCookie("sessionCartId")

          if (sessionFavoriteId && userId) {
            // Merge favorites in the background (don't block the response)
            console.log(
              `Starting favorite merge for user ${userId} with session ${sessionFavoriteId}`,
            )
            await mergeFavorites(userId, sessionFavoriteId)
          }

          if (sessionCartId && userId) {
            // Merge carts in the background (don't block the response)
            console.log(
              `Starting cart merge for user ${userId} with session ${sessionCartId}`,
            )
            await mergeCarts(userId, sessionCartId)
          }
        } catch (error) {
          console.error(`Error accessing cookies during ${ctx.path}:`, error)
        }
      }

      // Only handle merging during actual authentication events, not session checks
      const isAuthenticationEvent =
        ctx.path.startsWith("/sign-up") ||
        ctx.path.startsWith("/sign-in") ||
        ctx.path.includes("/callback") ||
        ctx.path.includes("/oauth") ||
        ctx.path.includes("/google") ||
        ctx.path.includes("/facebook") ||
        ctx.path.includes("/instagram")

      // Skip session checks and other non-authentication requests
      if (ctx.path === "/get-session" || !isAuthenticationEvent) {
        return
      }

      // Only run merging logic during authentication events
      const session = ctx.context.session || ctx.context.newSession
      if (session?.user?.id) {
        console.log(
          `Authentication event for user: ${session.user.id} on path: ${ctx.path}`,
        )
        await handleMerging(session.user.id)
      } else {
        console.log(`Auth path but no session found: ${ctx.path}`)
      }
    }),
  },

  /**
   * Database operation hooks
   * Functions that run during database CRUD operations
   */
  databaseHooks: {
    user: {
      create: {
        // Runs before a user is created in the database
        before: async (user) => {
          // Get admin email addresses from environment variables
          const adminEmail = env.ADMIN_EMAIL.split(",") || []

          // Assign ADMIN role if the email is in the admin list
          if (adminEmail.includes(user.email)) {
            return { data: { ...user, role: UserRole.ADMIN } }
          }

          // Otherwise, return user data unchanged (default role will be USER)
          return { data: user }
        },
      },
    },
  },
} satisfies BetterAuthOptions // Type check against BetterAuth options

/**
 * Initialize the authentication system with options and plugins
 */
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

    /**
     * Custom session plugin
     * Allows controlling what user data gets included in the session
     */
    customSession(async ({ session, user }) => {
      // Return carefully selected user and session data
      // This controls what information is stored in the session cookie
      return {
        session: {
          expiresAt: session.expiresAt, // When the session expires
          token: session.token, // Session token
          userAgent: session.userAgent, // User's browser info
        },
        user: {
          id: user.id, // User ID
          email: user.email, // User email
          name: user.name, // User name
          image: user.image, // User profile image
          createdAt: user.createdAt, // Account creation date
          role: user.role, // User role (ADMIN or USER)
          phone: user.phone, // User phone number
        },
      }
    }, options),
  ],
})

/**
 * Auth error codes type
 * This provides strongly-typed error handling for authentication errors
 */
export type AuthErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN"
