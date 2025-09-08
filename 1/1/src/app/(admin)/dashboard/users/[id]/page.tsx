import { type Metadata } from "next"
import { Suspense } from "react"

import type { WithRequiredIdParams } from "@/types"

import { getUserByIdAdmin } from "@/data"

import { UserPageWrapper } from "@/features/admin/features/users/components/user-page-wrapper"
import { UserPageWrapperSkeleton } from "@/features/admin/features/users/components/user-page-wrapper-skeleton"

export default async function UserPage({ params }: WithRequiredIdParams) {
  return (
    <Suspense fallback={<UserPageWrapperSkeleton />}>
      <UserPageWrapper params={params} />
    </Suspense>
  )
}

export async function generateMetadata({
  params,
}: WithRequiredIdParams): Promise<Metadata> {
  const { id } = await params
  const user = await getUserByIdAdmin(id)

  if (!user) {
    return {
      title: "User Not Found",
    }
  }

  return {
    title: `Edit User - ${user.name || user.email}`,
    description: `Edit user role for ${user.name || user.email}`,
  }
}
