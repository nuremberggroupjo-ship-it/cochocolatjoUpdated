import { FC } from "react"

import { getBannersPublic } from "@/data"

import { HeroSection } from "@/features/home/sections/hero-section"

export const HeroSectionWrapper: FC = async () => {
  // Fetch active banners from database
  const banners = await getBannersPublic()
  if (!banners || banners.length === 0) {
    // Return fallback or null if no banners
    return null
  }

  return <HeroSection banners={banners} />
}
