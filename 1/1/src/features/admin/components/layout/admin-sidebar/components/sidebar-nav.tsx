"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ChevronRightIcon } from "lucide-react"

import { capitalize } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { SvgIcon } from "@/components/shared/svg-icon"

import type { SidebarNavItem } from "@/features/admin/types"

interface SidebarNavProps {
  label?: string
  items: SidebarNavItem[]
}

export const SidebarNav = ({ items, label }: SidebarNavProps) => {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const handleClickOnMobile = () => setOpenMobile(false)
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={capitalize(item.title)}
                onClick={handleClickOnMobile}
              >
                <Link href={item.href}>
                  <SvgIcon icon={item.icon} />
                  <span className="capitalize">{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.subItems?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="hover:bg-sidebar-accent-foreground/5 data-[state=open]:rotate-90">
                      <ChevronRightIcon />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.href}
                            onClick={handleClickOnMobile}
                          >
                            <Link href={subItem.href}>
                              <span className="capitalize">
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
