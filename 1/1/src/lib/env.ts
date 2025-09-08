import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    // Authentication
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    FACEBOOK_CLIENT_ID: z.string().min(1),
    FACEBOOK_CLIENT_SECRET: z.string().min(1),

    ADMIN_EMAIL: z.string().min(1),
    // Uploadthing
    UPLOADTHING_TOKEN: z.string().min(1),
    UPLOADTHING_SECRET_KEY: z.string().min(1),
    // Resend
RESEND_API_KEY: z.string().min(1),
    // Cron Job
    CRON_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1).url(),
    // Address
    NEXT_PUBLIC_LOCATION_LABEL: z.string().min(1),
    NEXT_PUBLIC_LOCATION_LINK: z.string().min(1).url(),
    NEXT_PUBLIC_PHONE_NUMBER: z.string().min(1),
    NEXT_PUBLIC_EMAIL: z.string().min(1),
    NEXT_PUBLIC_OPENING_HOURS: z.string().min(1),
    // Social Media
    NEXT_PUBLIC_FACEBOOK_URL: z.string().min(1),
    NEXT_PUBLIC_INSTAGRAM_URL: z.string().min(1),
    // Uploadthing
    NEXT_PUBLIC_UPLOADTHING_APP_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    // Address
    NEXT_PUBLIC_LOCATION_LABEL: process.env.NEXT_PUBLIC_LOCATION_LABEL,
    NEXT_PUBLIC_LOCATION_LINK: process.env.NEXT_PUBLIC_LOCATION_LINK,
    NEXT_PUBLIC_PHONE_NUMBER: process.env.NEXT_PUBLIC_PHONE_NUMBER,
    NEXT_PUBLIC_EMAIL: process.env.NEXT_PUBLIC_EMAIL,
    NEXT_PUBLIC_OPENING_HOURS: process.env.NEXT_PUBLIC_OPENING_HOURS,
    // Social Media
    NEXT_PUBLIC_FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    NEXT_PUBLIC_INSTAGRAM_URL: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    // Uploadthing
    NEXT_PUBLIC_UPLOADTHING_APP_ID: process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID,
  },
})
