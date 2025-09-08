"use client"

import { useSearchParams } from "next/navigation"
import { FC, useState } from "react"

import { signIn } from "@/lib/auth-client"

import { LoadingButton } from "@/components/shared/loading-button"
import { SvgIcon } from "@/components/shared/svg-icon"

import { SocialProvider, getSocialProvider } from "@/features/auth/lib/config"

interface AuthSocialsProps {
  provider: SocialProvider
}

export const AuthSocials: FC<AuthSocialsProps> = ({ provider }) => {
  const searchParams = useSearchParams()
  const callbackURL = searchParams.get("callbackURL") || "/"

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Get provider configuration
  const { label, icon } = getSocialProvider(provider)

  const handleProviderSignIn = async () => {
    await signIn.social({
      provider,
      callbackURL,
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true)
        },
        onResponse: () => {
          setIsLoading(false)
        },
      },
    })
  }
  return (
    <div>
      <LoadingButton
        size="lg"
        className="w-auto"
        variant="outline"
        onClick={() => {
          handleProviderSignIn()
        }}
        isLoading={isLoading}
      >
        <SvgIcon icon={icon} />
        <span>{label}</span>
      </LoadingButton>
    </div>
  )
}
