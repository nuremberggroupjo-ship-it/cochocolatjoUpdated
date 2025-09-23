import * as React from "react"

interface PasswordResetEmailProps {
  resetUrl: string
  userName?: string | null
}

export function PasswordResetEmail({ resetUrl, userName }: PasswordResetEmailProps) {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen",
        lineHeight: 1.5,
        color: "#222",
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>
        {userName ? `Hi ${userName},` : "Hello,"}
      </h2>
      <p style={{ margin: "0 0 12px" }}>
        We received a request to reset your password. Click the button below to choose a
        new one. This link will expire in 30 minutes.
      </p>
      <p style={{ margin: "0 0 24px" }}>
        <a
          href={resetUrl}
          style={{
            background: "#7B3F00",
            color: "#fff",
            padding: "12px 20px",
            textDecoration: "none",
            borderRadius: "6px",
            display: "inline-block",
          }}
        >
          Reset Password
        </a>
      </p>
      <p style={{ fontSize: "14px", margin: "0 0 8px" }}>
        If the button doesn’t work, copy and paste this URL into your browser:
      </p>
      <code
        style={{
          display: "block",
          background: "#f5f5f5",
          padding: "8px",
          wordBreak: "break-all",
          borderRadius: "4px",
          fontSize: "12px",
          marginBottom: "24px",
        }}
      >
        {resetUrl}
      </code>
      <p style={{ fontSize: "12px", color: "#555" }}>
        If you didn’t request this, you can safely ignore this email.
      </p>
      <p style={{ fontSize: "13px", marginTop: "32px" }}>– Co Chocolat Jo Team</p>
    </div>
  )
}