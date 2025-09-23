"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function ResetPasswordPage() {
  const search = useSearchParams()
  const router = useRouter()

  const token = search.get("token") || ""
  const email = search.get("email") || ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = token && email && password && password === confirm && password.length >= 6

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,         // CRITICAL: include email
          token,         // raw token from query
          password,      // new password
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to reset password")
      } else {
        setMessage("Password reset successfully. Redirecting to login...")
        setTimeout(() => router.push("/login"), 2000)
      }
    } catch (err: any) {
      setError("Unexpected error")
    } finally {
      setSubmitting(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="mx-auto max-w-md p-4">
        <p className="text-red-600 font-medium">
          Invalid reset link (missing token or email).
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="text-xl font-semibold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            value={password}
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
            disabled={!canSubmit || submitting}
          className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
    </div>
  )
}