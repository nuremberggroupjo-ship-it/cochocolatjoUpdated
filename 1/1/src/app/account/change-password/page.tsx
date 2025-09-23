import { Metadata } from "next"
import { ChangePasswordForm } from "@/features/auth/features/change-password/components/change-password-form"
import { AuthSectionWrapper } from "@/features/auth/components/auth-section-wrapper"
import { ShopFooter } from "@/components/layout/shop-footer"

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update your account password",
}

export default function ChangePasswordPage() {
  return (
    <>
    <AuthSectionWrapper
      title="Change Password"
      description="Enter your current password and choose a new one."
      backButtonLabel="Back to Home"
      backButtonHref="/"
      hideSocial
      fullscreenCenter
      maxWidth="md"
      contentClassName="space-y-6"
    >
            {/*test  comment   */}

      <ChangePasswordForm />
      
    </AuthSectionWrapper>
    <ShopFooter/>
    </>
    
  )
}