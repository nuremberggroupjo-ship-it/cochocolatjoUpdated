import type { Metadata } from "next"
import localFont from "next/font/local"

import { Providers } from "@/providers"

import "@/assets/styles/globals.css"

import { ROOT_METADATA } from "@/constants"

const questrial = localFont({
  display: "swap",
  src: "../assets/fonts/questrial/Questrial-Regular.ttf",
  variable: "--font-questrial",
  fallback: ["sans-serif"],
})

const melodySouthernScript = localFont({
  display: "swap",
  src: "../assets/fonts/melody-southern/MelodySouthern-Script.otf",
  variable: "--font-melody-southern-script",
})

export const metadata: Metadata = ROOT_METADATA

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${questrial.variable} ${melodySouthernScript.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
