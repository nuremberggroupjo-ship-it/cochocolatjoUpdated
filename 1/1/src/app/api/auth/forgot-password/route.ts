import { NextResponse } from "next/server"
import crypto from "crypto"
import prisma from "@/lib/prisma"
import { sendResetEmail } from "@/lib/email/send-reset-email"

export const runtime = "nodejs" // ensure Node runtime (avoid Edge surprises)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Anti-enumeration pattern: always return ok
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })
    if (!user) {
      return NextResponse.json({ ok: true })
    }

    const rawToken =
      crypto.randomUUID() + crypto.randomBytes(16).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex")
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 min

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { tokenHash, expiresAt },
      create: { userId: user.id, tokenHash, expiresAt },
    })

    const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      user.email,
    )}`

    if (process.env.NODE_ENV !== "production") {
      console.log("[PW-RESET][DEV] Reset URL:", resetUrl)
    }

    try {
      const messageId = await sendResetEmail({
        to: user.email,
        resetUrl,
      })
      return NextResponse.json({
        ok: true,
        messageId,
        devResetUrl:
          process.env.NODE_ENV !== "production" ? resetUrl : undefined,
      })
    } catch (emailErr: any) {
      console.error("[PW-RESET] Email send failure:", emailErr)
      // Still return ok to prevent enumeration; optionally indicate partial failure internally
      return NextResponse.json({ ok: true, emailQueued: false })
    }
  } catch (e) {
    console.error("[PW-RESET] Internal error:", e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}