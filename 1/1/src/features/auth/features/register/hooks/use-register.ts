"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { signUp } from "@/lib/auth-client"
import formatError, { type FormErrorResult } from "@/lib/helpers/format-error"

import { REGISTER_FORM_DEFAULT_VALUES } from "@/features/auth/features/register/constants"
import {
  RegisterFormType,
  registerFormSchema,
} from "@/features/auth/features/register/schemas/register.schema"

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<FormErrorResult>(null)

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: REGISTER_FORM_DEFAULT_VALUES,
  })

  const router = useRouter()

  const clearError = () => setError(null)

  const register = async (values: RegisterFormType) => {
    // Clear any previous errors
    clearError()

    try {
      // Validate form data using zod schema
      const validatedValues = registerFormSchema.parse(values)
      const { name, email, password } = validatedValues

      const { error: signUpError } = await signUp.email(
        { email, password, name },
        {
          onRequest: () => {
            setIsLoading(true)
          },
          onResponse: () => {
            setIsLoading(false)
          },
          onSuccess: () => {
            form.reset()
            router.push("/")
            toast.success("Account created successfully!")
          },
          onError: (ctx) => {
            setError(ctx.error.message)
          },
        },
      )

      if (signUpError) {
        setError(signUpError.message)
      }
    } catch (error) {
      setError(formatError(error))
    }
  }

  return {
    register,
    isLoading,
    error,
    clearError,
    form,
  }
}
