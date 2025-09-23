import { NextResponse } from "next/server"
import crypto from "crypto"
import prisma from "@/lib/prisma"
import { hashPassword, verifyPassword } from "@/lib/argon2"

export const runtime = "nodejs"

interface ResetBody {
  email: string
  token: string
  password: string
}

// We will consider both legacy and current possibilities
const CREDENTIAL_PROVIDERS = ["credential", "email"]

function normalizeEmail(e: string) {
  return e.trim().toLowerCase()
}

export async function POST(req: Request) {
  try {
    const { email, token, password } = (await req.json()) as Partial<ResetBody>

    if (!email || !token || !password) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "PASSWORD_TOO_SHORT" }, { status: 400 })
    }

    const normalizedEmail = normalizeEmail(email)

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    })
    if (!user) return NextResponse.json({ ok: true })

    const tokenRow = await prisma.passwordResetToken.findUnique({
      where: { userId: user.id },
    })
    if (!tokenRow) {
      return NextResponse.json({ error: "INVALID_OR_EXPIRED" }, { status: 400 })
    }

    const incomingHash = crypto.createHash("sha256").update(token).digest("hex")
    if (
      tokenRow.tokenHash !== incomingHash ||
      tokenRow.expiresAt.getTime() < Date.now()
    ) {
      return NextResponse.json({ error: "INVALID_OR_EXPIRED" }, { status: 400 })
    }

    const newHash = await hashPassword(password)

    // Fetch all potential credential accounts
    const accounts = await prisma.account.findMany({
      where: {
        userId: user.id,
        providerId: { in: CREDENTIAL_PROVIDERS },
      },
    })

    // Strategy:
    // 1. Prefer updating 'credential' row (the one login is using).
    // 2. If no 'credential', update/create 'email'.
    // 3. If neither exist, create 'credential'.
    let primary = accounts.find(a => a.providerId === "credential")
    let secondary = accounts.find(a => a.providerId === "email")

    if (!primary && !secondary) {
      // Create canonical 'credential'
      primary = await prisma.account.create({
        data: {
          userId: user.id,
          providerId: "credential",
          accountId: normalizedEmail, // or user.id if that's your style
          password: newHash,
        },
      })
    } else {
      if (primary) {
        primary = await prisma.account.update({
          where: { id: primary.id },
            data: { password: newHash },
        })
      }
      if (secondary) {
        // Keep them in sync for now (temporary until you migrate)
        await prisma.account.update({
          where: { id: secondary.id },
          data: { password: newHash },
        })
      }
      if (!primary && secondary) {
        // Promote secondary logically (optional to rename providerId later)
        primary = secondary
      }
    }

    let verifyOK: boolean | undefined
    if (process.env.NODE_ENV !== "production" && primary?.password) {
      verifyOK = await verifyPassword(primary.password, password)
      console.log("[PW-RESET] verifyOK =", verifyOK)
    }

    await prisma.passwordResetToken.delete({ where: { userId: user.id } })
    await prisma.session.deleteMany({ where: { userId: user.id } }) // optional: force re-login

    return NextResponse.json({
      ok: true,
      ...(process.env.NODE_ENV !== "production"
        ? {
            debug: {
              verifyOK,
              updatedProviders: accounts.map(a => a.providerId),
              canonicalProvider: primary?.providerId,
            },
          }
        : {}),
    })
  } catch (e) {
    console.error("[PW-RESET] INTERNAL", e)
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 })
  }
}