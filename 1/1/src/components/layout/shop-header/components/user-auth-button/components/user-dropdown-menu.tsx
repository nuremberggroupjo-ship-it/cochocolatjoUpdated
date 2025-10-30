"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FC, useState, useTransition } from "react"

import {
  HeartIcon,
  ListOrderedIcon,
  LogOutIcon,
  KeyRoundIcon,        // NEW import for change password
} from "lucide-react"

import CartSvg from "@/assets/svg/cart.svg"

import { type Session, signOut } from "@/lib/auth-client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { SvgIcon } from "@/components/shared/svg-icon"

import { handleSignOut } from "@/features/auth/actions/sign-out.action"

import { DashboardDropdownItem } from "./dashboard-dropdown-item"

interface UserDropdownMenuProps {
  user: Session["user"]
}

export const UserDropdownMenu: FC<UserDropdownMenuProps> = ({ user }) => {
  const isAdmin = user?.role === "ADMIN"
  const [open, setOpen] = useState(false)

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClickLogout = () => {
    startTransition(async () => {
      try {
        await handleSignOut(user.id)
        await signOut()
        await new Promise((resolve) => setTimeout(resolve, 100))
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 200)
      } catch (error) {
      }
    })
  }

  const handleCloseMenu = () => setOpen(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <span className="hover:text-primary text-muted-foreground hidden cursor-pointer capitalize transition-all duration-200 lg:block">
          my account
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <DropdownMenuItem className="py-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-1 flex flex-col">
            <p className="text-sm font-medium">{user.name}</p>
            {user.email && (
              <p className="text-muted-foreground text-xs">{user.email}</p>
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCloseMenu}>
          <Link
            href="/favorites"
            className="flex w-full items-center gap-2 capitalize"
          >
            <HeartIcon className="text-muted-foreground size-4" />
            My Favorites
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCloseMenu}>
          <Link
            href="/order-history"
            className="flex w-full items-center gap-2 capitalize"
          >
            <ListOrderedIcon className="text-muted-foreground size-4" />
            My Orders
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCloseMenu}>
            <Link
              href="/cart"
              className="flex w-full items-center gap-2 capitalize"
            >
              <SvgIcon
                icon={CartSvg}
                className="fill-muted-foreground stroke-muted-foreground size-4 stroke-0"
              />
              My Cart
            </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isAdmin && (
          <>
            <DashboardDropdownItem />
          </>
        )}

        {/* NEW: Change Password item */}
        <DropdownMenuItem onClick={handleCloseMenu} className="capitalize">
          <Link
            href="/account/change-password"
            className="flex w-full items-center gap-2"
          >
            <KeyRoundIcon className="text-muted-foreground size-4" />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleClickLogout}
          disabled={isPending}
          className="capitalize"
        >
          <LogOutIcon className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}