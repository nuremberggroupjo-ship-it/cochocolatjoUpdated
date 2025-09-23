"use client"

import { useSearchParams } from "next/navigation"
import { ResetPasswordForm } from "@/features/auth/features/reset-password/components/reset-password-form"
import { AuthSectionWrapper } from "@/features/auth/components/auth-section-wrapper"

export function ResetPasswordContent() {
  const params = useSearchParams()
  const token = params.get("token") || ""

  return (
    <AuthSectionWrapper
      title="Reset Password"
      description="Enter and confirm your new password."
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <ResetPasswordForm token={token} />
    </AuthSectionWrapper>
  )
}