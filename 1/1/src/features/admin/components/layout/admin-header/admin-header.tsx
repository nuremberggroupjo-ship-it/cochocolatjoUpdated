import { FC } from "react"

import { cn } from "@/lib/utils"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { AppBreadcrumb } from "@/components/shared/app-breadcrumb"

export const AdminHeader: FC = () => {
  return (
    <nav
      className={cn(
        "animate-slide-down flex h-14 shrink-0 items-center gap-2 p-2",
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 backdrop-blur",
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="size-9" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <AppBreadcrumb listClassName="text-sm" />
      </div>
    </nav>
  )
}
