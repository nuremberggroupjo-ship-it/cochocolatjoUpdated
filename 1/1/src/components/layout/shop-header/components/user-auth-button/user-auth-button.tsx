"use client"

import { FC } from "react"

import { useSession } from "@/lib/auth-client"

import { Loader } from "@/components/shared/loader"

import { SigninLinkIcon, UserDropdownMenu } from "./components"

export const UserAuthButton: FC = () => {
  const { data: session, isPending } = useSession()

  // If session is pending, show a loader
  if (isPending) {
    return (
      <Loader
        className="text-muted-foreground"
        wrapperClassName="hidden lg:block"
      />
    )
  }

  // If user is signed in, show the log out button
  if (session && session?.user) {
    return <UserDropdownMenu user={session.user} />
  }
  // If no user is signed in, show the sign-in link icon
  return <SigninLinkIcon />
}
