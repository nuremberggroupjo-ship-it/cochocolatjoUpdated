"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { signIn } from "@/lib/auth-client"
import formatError, { type FormErrorResult } from "@/lib/helpers/format-error"

import { LOGIN_FORM_DEFAULT_VALUES } from "@/features/auth/features/login/constants"
import {
  LoginFormType,
  loginFormSchema,
} from "@/features/auth/features/login/schemas/login.schema"

export const useLogin = () => {
  const searchParams = useSearchParams()

  const callbackURL = searchParams.get("callbackURL") || "/"

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<FormErrorResult>(null)

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
  })

  const router = useRouter()

  const clearError = () => setError(null)

  const login = async (values: LoginFormType) => {
    // Clear any previous errors
    clearError()

    try {
      // Validate form data using zod schema
      const validatedValues = loginFormSchema.parse(values)
      const { email, password } = validatedValues

      const { error: signInError } = await signIn.email(
        { email, password },
        {
          onRequest: () => {
            setIsLoading(true)
          },
          onResponse: () => {
            setIsLoading(false)
          },
          onSuccess: () => {
            form.reset()
            // Add a small delay to ensure server-side merge completes
            setTimeout(() => {
              router.push(callbackURL)
              // Force refresh to ensure cart data is updated
              router.refresh()
            }, 200)
          },
          onError: (ctx) => {
            setError(ctx.error.message)
          },
        },
      )

      if (signInError) {
        setError(signInError.message)
      }
    } catch (error) {
      setError(formatError(error))
    }
  }

  return {
    login,
    isLoading,
    error,
    clearError,
    form,
  }
}
