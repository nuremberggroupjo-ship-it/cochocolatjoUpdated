import Link from "next/link"

import { LayoutDashboardIcon } from "lucide-react"

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

import { SIDEBAR_NAV_LIST } from "@/features/admin/constants"

export const DashboardDropdownItem = () => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-2 capitalize">
        <LayoutDashboardIcon className="text-muted-foreground size-4" />
        Dashboard
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {SIDEBAR_NAV_LIST.map((item) => (
          <DropdownMenuItem key={item.title}>
            <Link
              href={item.href}
              className="flex items-center gap-2 capitalize"
            >
              <item.icon className="text-muted-foreground size-4" />
              {item.title}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
