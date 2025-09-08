import { notFound } from "next/navigation"

import type { WithRequiredIdParams } from "@/types"

import { getUserByIdAdmin } from "@/data"

import { env } from "@/lib/env"

import { Separator } from "@/components/ui/separator"

import { AdminHeading } from "@/features/admin/components/shared/admin-heading"
import { UserAddressDisplay } from "@/features/admin/features/users/components/user-address-display"
import { UserEditForm } from "@/features/admin/features/users/components/user-edit-form"
import { UserInfoDisplay } from "@/features/admin/features/users/components/user-info-display"

export const UserPageWrapper = async ({ params }: WithRequiredIdParams) => {
  const { id } = await params
  const user = await getUserByIdAdmin(id)

  if (!user) {
    notFound()
  }

  const adminEmail = env.ADMIN_EMAIL.split(",") || []

  return (
    <>
      <AdminHeading
        title="Edit User"
        description={`Manage role for ${user.name || user.email}`}
      />
      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Information - Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* User Info Card */}
          <UserInfoDisplay user={user} />

          {/* Addresses Card */}
          {user.addresses &&
            Array.isArray(user.addresses) &&
            user.addresses.length > 0 && <UserAddressDisplay user={user} />}
        </div>

        {/* Edit Form - Right Column */}
        {!adminEmail.includes(user.email) && (
          <div className="lg:col-span-1">
            <UserEditForm user={user} />
          </div>
        )}
      </div>
    </>
  )
}
