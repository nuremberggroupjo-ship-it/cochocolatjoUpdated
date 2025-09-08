import { neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import ws from "ws"

import { PrismaClient } from "@/lib/_generated/prisma"
import { env } from "@/lib/env"

neonConfig.webSocketConstructor = ws

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true

// Type definitions
declare global {
  var prisma: PrismaClient | undefined
}

const connectionString = `${env.DATABASE_URL}`

const adapter = new PrismaNeon({ connectionString })

const prisma = global.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV === "development") global.prisma = prisma

export default prisma
