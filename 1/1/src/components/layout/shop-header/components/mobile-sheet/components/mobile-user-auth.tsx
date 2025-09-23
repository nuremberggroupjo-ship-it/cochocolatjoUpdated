"use client"

import { useRouter } from "next/navigation"
import { FC, useState, useTransition } from "react"
import { AlignLeftIcon, KeyRoundIcon } from "lucide-react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LayoutDashboardIcon,
  ListOrderedIcon,
  LogOutIcon,
  User2Icon,
} from "lucide-react"

import { signOut, useSession } from "@/lib/auth-client"

import { handleSignOut } from "@/features/auth/actions/sign-out.action"

interface MobileUserAuthProps {
  handleCloseSheet: () => void
}

export const MobileUserAuth: FC<MobileUserAuthProps> = ({
  handleCloseSheet,
}) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const { data: session, isPending: isSessionPending } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  const handleClickLogout = () => {
    startTransition(async () => {
      try {
        if (!session) return

        // Handle server-side cleanup first
        await handleSignOut(session.user.id)

        // Then sign out from auth system
        await signOut()
        // Wait for any pending server actions to complete
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Simple navigation - let server-side revalidation handle cache
        setTimeout(() => {
          router.push("/")
          // Force refresh to ensure cart data is updated
          router.refresh()
        }, 200)

        handleCloseSheet()
        // Force page refresh to ensure clean state
        // window.location.href = "/"
      } catch (error) {
        console.error("Sign out error:", error)
      }
    })
  }

  // If session is pending, show a loader
  if (isPending || isSessionPending) {
    return (
      <div className="text-muted-foreground flex items-center gap-2">
        <span>Loading...</span>
      </div>
    )
  }

  if (session) {
    return (
      <div className="w-full">
        <li
          className="inline-flex w-full cursor-pointer items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="inline-flex items-center gap-2">
            <User2Icon className="text-primary size-6 stroke-1" />
            <span className="text-primary">My Account</span>
          </div>
          {isOpen ? (
            <ChevronUpIcon className="text-primary size-4" />
          ) : (
            <ChevronDownIcon className="text-primary size-4" />
          )}
        </li>

        {isOpen && (
          <ul className="mt-2 ml-8 flex flex-col space-y-3">
            <li
              className="inline-flex cursor-pointer items-center gap-2"
              onClick={() => {
                handleCloseSheet()
                router.push("/order-history")
              }}
            >
              <ListOrderedIcon className="text-primary size-5 stroke-1" />
              <span className="text-primary">My orders</span>
            </li>
            <li
          onClick={() => {
            handleCloseSheet()
            router.push("/account/change-password")
          }}
          className="inline-flex items-center gap-2"
        >
          <KeyRoundIcon className="text-primary size-5" />
          <span className="text-primary">Change Password</span>
        </li>
            {isAdmin && (
              <li
                className="inline-flex cursor-pointer items-center gap-2"
                onClick={() => {
                  handleCloseSheet()
                  router.push("/dashboard")
                }}
              >
                <LayoutDashboardIcon className="text-primary size-5 stroke-1" />
                <span className="text-primary">Dashboard</span>
              </li>
            )}
            <li
              className="inline-flex cursor-pointer items-center gap-2"
              onClick={handleClickLogout}
            >
              <LogOutIcon className="text-primary size-5 stroke-1" />
              <span className="text-primary">Logout</span>
            </li>
          </ul>
        )}
      </div>
    )
  }

  return (
    <li
      onClick={() => {
        handleCloseSheet()
        router.push("/login")
      }}
      className="inline-flex items-center gap-2"
    >
      <User2Icon className="text-primary size-6 stroke-1" />
      <span className="text-primary">Sign in</span>
    </li>
  )
}
