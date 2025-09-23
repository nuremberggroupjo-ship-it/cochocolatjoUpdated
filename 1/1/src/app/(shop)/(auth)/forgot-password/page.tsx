import { Metadata } from "next"
import Link from "next/link"
import { ForgotPasswordForm } from "@/features/auth/features/reset-password/components/forgot-password-form"
import { AuthSectionWrapper } from "@/features/auth/components/auth-section-wrapper"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
  return (
    <AuthSectionWrapper
      title="Forgot Password"
      description="Enter your email address and we'll send you a reset link."
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="space-y-6">
        <ForgotPasswordForm />
        <p className="text-xs text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthSectionWrapper>
  )
}