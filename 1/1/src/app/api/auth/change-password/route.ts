import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { hashPassword, verifyPassword } from "@/lib/argon2"

export const runtime = "nodejs"

const CREDENTIAL_PROVIDERS = ["credential", "email"]

export async function POST(req: Request) {
  try {
    // Session lookup (ADD IT HERE)
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    }
    const userId = session.user.id

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "PASSWORD_TOO_SHORT" }, { status: 400 })
    }
    if (newPassword === currentPassword) {
      return NextResponse.json(
        { error: "PASSWORD_SAME_AS_OLD" },
        { status: 400 }
      )
    }

    const accounts = await prisma.account.findMany({
      where: { userId, providerId: { in: CREDENTIAL_PROVIDERS } },
    })
    if (!accounts.length) {
      return NextResponse.json(
        { error: "NO_CREDENTIAL_ACCOUNT" },
        { status: 400 }
      )
    }

    // Prefer 'credential'
    const primary =
      accounts.find(a => a.providerId === "credential") || accounts[0]

    if (!primary.password) {
      return NextResponse.json(
        { error: "NO_PASSWORD_SET" },
        { status: 400 }
      )
    }

    const valid = await verifyPassword({
      hash: primary.password,
      password: currentPassword,
    })
    if (!valid) {
      return NextResponse.json(
        { error: "INVALID_CURRENT_PASSWORD" },
        { status: 400 }
      )
    }

    const newHash = await hashPassword(newPassword)

    await prisma.account.updateMany({
      where: { userId, providerId: { in: CREDENTIAL_PROVIDERS } },
      data: { password: newHash },
    })

    await prisma.session.deleteMany({ where: { userId } }) 

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[CHANGE-PASSWORD] INTERNAL", e)
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 })
  }
}