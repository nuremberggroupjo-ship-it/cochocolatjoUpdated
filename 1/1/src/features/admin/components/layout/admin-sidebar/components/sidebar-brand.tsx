import Link from "next/link"
import { FC } from "react"

import SmallLogoSvg from "@/assets/svg/small-logo.svg"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { SvgIcon } from "@/components/shared/svg-icon"

export const SidebarBrand: FC = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <SvgIcon
                icon={SmallLogoSvg}
                className="stroke-primary h-10/12 w-10/12"
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Co Chocolat</span>
              <span className="text-muted-foreground truncate text-xs">
                Simply Healthy
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
