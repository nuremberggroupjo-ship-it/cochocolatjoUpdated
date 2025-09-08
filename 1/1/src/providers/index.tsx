import { NuqsAdapter } from "nuqs/adapters/next/app"

import { Toaster } from "@/components/ui/sonner"

import { UploadthingPlugin } from "./uploadthing-plugin"

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <NuqsAdapter>
      <UploadthingPlugin />
      {children}
      <Toaster position="bottom-right" />
    </NuqsAdapter>
  )
}
