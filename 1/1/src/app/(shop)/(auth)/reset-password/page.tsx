import { Suspense } from "react"
import type { Metadata } from "next"
import { ResetPasswordClient } from "./reset-password-client"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter a new password to regain access to your account.",
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">Reset Password</h1>
      <p className="mb-6 text-sm text-muted-foreground">
              {/*test  comment   */}

        Provide a new password for the account linked to your reset link.
      </p>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading reset form...</p>}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  )
}