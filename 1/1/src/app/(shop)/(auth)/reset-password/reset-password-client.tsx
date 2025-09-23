"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"

type ApiResponse =
  | { success: true }
  | { error: string }

export function ResetPasswordClient() {
  const search = useSearchParams()
  const router = useRouter()

  const token = search.get("token") || ""
  const email = search.get("email") || ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [touchedConfirm, setTouchedConfirm] = useState(false)

  const passwordsMatch = password === confirm
  const strongEnough = password.length >= 6
  const canSubmit =
    !!token &&
    !!email &&
    passwordsMatch &&
    strongEnough &&
    !submitting

  const resetFeedback = useCallback(() => {
    setError(null)
    setMessage(null)
  }, [])

  useEffect(() => {
    resetFeedback()
  }, [password, confirm, resetFeedback])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          password,
        }),
      })

      const data: ApiResponse = await res.json()

      if (!res.ok) {
        if ("error" in data) {
          setError(data.error)
        } else {
          setError("Failed to reset password.")
        }
        return
      }

      if ("error" in data) {
        setError(data.error)
        return
      }

      // Success path
      setMessage("Password reset successfully. Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 1500)
    } catch {
      setError("Unexpected error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4">
        <h2 className="mb-1 text-sm font-semibold text-red-700">
          Invalid Reset Link
        </h2>
        <p className="text-xs text-red-600">
          The link is missing a token or email parameter. Request a new password
          reset email and try again.
        </p>
      </div>
    )
  }

  const passwordHint =
    !strongEnough && password.length > 0
      ? "Password must be at least 6 characters."
      : ""

  const confirmHint =
    touchedConfirm && !passwordsMatch
      ? "Passwords do not match."
      : ""

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-1">
        <label
          htmlFor="new-password"
          className="block text-sm font-medium"
        >
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          value={password}
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="w-full rounded border px-3 py-2 text-sm"
          required
          aria-describedby={passwordHint ? "pw-hint" : undefined}
          aria-invalid={!!passwordHint}
        />
        {passwordHint && (
          <p id="pw-hint" className="text-xs text-red-600">
            {passwordHint}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium"
        >
          Confirm Password
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onBlur={() => setTouchedConfirm(true)}
          autoComplete="new-password"
          className="w-full rounded border px-3 py-2 text-sm"
          required
          aria-describedby={confirmHint ? "confirm-hint" : undefined}
          aria-invalid={!!confirmHint}
        />
        {confirmHint && (
          <p id="confirm-hint" className="text-xs text-red-600">
            {confirmHint}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60"
      >
        {submitting ? "Resetting..." : "Reset Password"}
      </button>

      {error && (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm font-medium text-green-600" role="status">
          {message}
        </p>
      )}
    </form>
  )
}