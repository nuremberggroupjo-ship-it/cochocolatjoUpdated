import { cookies } from "next/headers"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AdminHeader } from "@/features/admin/components/layout/admin-header"
import { AdminSidebar } from "@/features/admin/components/layout/admin-sidebar"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset className="overflow-hidden">
        <AdminHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
