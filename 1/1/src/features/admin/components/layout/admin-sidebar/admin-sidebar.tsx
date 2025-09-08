"use client"

import { FC } from "react"

import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { SIDEBAR_NAV_LIST } from "@/features/admin/constants"

import { SidebarBrand, SidebarNav } from "./components"

export const AdminSidebar: FC = () => {
  return (
    <Sidebar collapsible="icon" className="animate-slide-right">
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <Separator className="bg-border/50" />
      <SidebarContent>
        <SidebarNav items={SIDEBAR_NAV_LIST} label="General" />
      </SidebarContent>
      <SidebarFooter>{/* nav user */}</SidebarFooter>
    </Sidebar>
  )
}
