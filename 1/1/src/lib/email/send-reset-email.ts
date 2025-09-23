import { Resend } from "resend"

const apiKey = process.env.RESEND_API_KEY
if (!apiKey) {
  console.error("[EMAIL][INIT] RESEND_API_KEY is missing. Emails will fail.")
}

const resend = apiKey ? new Resend(apiKey) : null

interface SendResetOptions {
  to: string
  resetUrl: string
}

export async function sendResetEmail({ to, resetUrl }: SendResetOptions) {
  if (!resend) {
    throw new Error("Resend client not initialized (missing RESEND_API_KEY)")
  }

  const from = process.env.EMAIL_FROM
  if (!from) throw new Error("EMAIL_FROM missing. Must be a verified sender or onboarding@resend.dev")

  // NOTE: If your domain is NOT verified yet, temporarily set:
  // EMAIL_FROM=onboarding@resend.dev
  // in your .env file so the email is accepted.

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;font-size:15px;color:#111">
      <h2 style="margin:0 0 12px">Password Reset</h2>
      <p style="margin:0 0 12px">
        You requested a password reset. This link is valid for 30 minutes:
      </p>
      <p style="margin:0 0 16px;word-break:break-all">
        <a href="${resetUrl}" style="color:#4f46e5;text-decoration:underline">${resetUrl}</a>
      </p>
      <p style="margin:0 0 8px">If you did not request this, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="font-size:12px;color:#666">If the button or link above doesn't work, copy and paste the URL into your browser.</p>
    </div>
  `

  console.log("[EMAIL][RESET] Sending via Resend", { to, from })

  const result = await resend.emails.send({
    from,
    to,
    subject: "Password Reset",
    html,
  })

  // Log full result for debugging (remove or redact later)
  console.log("[EMAIL][RESET] Resend response:", JSON.stringify(result, null, 2))

  if (result.error) {
    console.error("[EMAIL][RESET] Resend reported error:", result.error)
    throw new Error("Resend send failed: " + (result.error?.message || "Unknown"))
  }

  if (!result.data?.id) {
    throw new Error("Resend returned no message ID; treat as failure.")
  }

  console.log("[EMAIL][RESET] Email queued successfully. Message ID:", result.data.id)
  return result.data.id
}