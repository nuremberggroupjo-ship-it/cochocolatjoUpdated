// Create this file: src/features/auth/config/social-providers.ts
import { FC, SVGProps } from "react"

import ColoredFacebookSvg from "@/assets/svg/colored-facebook.svg"
// import ColoredInstagramSvg from "@/assets/svg/colored-instagram.svg"
import GoogleSvg from "@/assets/svg/google.svg"

export type SocialProvider = "google" | "facebook"

export interface SocialProviderConfig {
  provider: SocialProvider
  label: string
  icon: FC<SVGProps<SVGSVGElement>>
}

export const SOCIAL_PROVIDERS: Record<SocialProvider, SocialProviderConfig> = {
  facebook: {
    provider: "facebook",
    label: "Continue with Facebook",
    icon: ColoredFacebookSvg,
  },
  // instagram: {
  //   provider: "instagram",
  //   label: "Continue with Instagram",
  //   icon: ColoredInstagramSvg,
  // },
  google: {
    provider: "google",
    label: "Continue with Google",
    icon: GoogleSvg,
  },
} as const

// Helper to get all providers as array
export const getSocialProviders = (): SocialProviderConfig[] => {
  return Object.values(SOCIAL_PROVIDERS)
}

// Helper to get specific provider config
export const getSocialProvider = (
  provider: SocialProvider,
): SocialProviderConfig => {
  return SOCIAL_PROVIDERS[provider]
}
