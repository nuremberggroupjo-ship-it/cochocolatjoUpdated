import type { Metadata } from "next"

import { verifySession } from "@/lib/dal"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  await verifySession({ isAdmin: true })

  return <div>DashboardPage</div>
}
