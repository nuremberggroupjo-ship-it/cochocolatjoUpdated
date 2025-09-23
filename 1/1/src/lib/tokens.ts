import crypto from "crypto"

export function generateResetToken(): { token: string; tokenHash: string; expiresAt: Date } {
  const token = crypto.randomBytes(32).toString("hex")
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
  return { token, tokenHash, expiresAt }
}

export function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex")
}