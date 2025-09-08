import { type Metadata } from "next"
import { Suspense } from "react"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { Loader } from "@/components/shared/loader"

import { AuthSectionWrapper } from "@/features/auth/components/auth-section-wrapper"
import { LoginForm } from "@/features/auth/features/login/components/login-form"

export const metadata: Metadata = createMetadata(PAGE_METADATA.login)

export default function LoginPage() {
  return (
    <AuthSectionWrapper
      title="Welcome back"
      description="Please enter your credentials to login."
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
    >
      <Suspense fallback={<Loader />}>
        <LoginForm />
      </Suspense>
    </AuthSectionWrapper>
  )
}
