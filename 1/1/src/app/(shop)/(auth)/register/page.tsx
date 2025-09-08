import { type Metadata } from "next"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { AuthSectionWrapper } from "@/features/auth/components/auth-section-wrapper"
import { RegisterForm } from "@/features/auth/features/register/components/register-form"

export const metadata: Metadata = createMetadata(PAGE_METADATA.register)

export default function RegisterPage() {
  return (
    <AuthSectionWrapper
      title="Create Account"
      description="Join us to enjoy personalized recommendations, faster checkout, and more."
      backButtonLabel="Already have an account?"
      backButtonHref="/login"
    >
      <RegisterForm />
    </AuthSectionWrapper>
  )
}
