import { type Metadata } from "next"

import { PAGE_METADATA, createMetadata } from "@/constants"

export const metadata: Metadata = createMetadata(PAGE_METADATA.authError)

export default function AuthErrorPage() {
  return <div>AuthErrorPage</div>
}
