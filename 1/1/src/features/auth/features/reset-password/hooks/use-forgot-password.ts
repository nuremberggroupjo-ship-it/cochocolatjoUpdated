"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ForgotPasswordSchema } from "../schemas/forgot-password.schema"
import { forgotPasswordSchema } from "../schemas/forgot-password.schema"

export function useForgotPassword() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function submit(values: ForgotPasswordSchema) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || "Failed to send reset email.")
      }
      setSuccess(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { form, submit, success, error, isLoading }
}