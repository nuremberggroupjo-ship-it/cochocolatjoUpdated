import { type Metadata } from "next"
import { Suspense } from "react"

import { type WithRequiredSearchParams } from "@/types"

import { Separator } from "@/components/ui/separator"

import { DataTableSkeleton } from "@/components/shared/data-table/components/data-table-skeleton"

import { AdminHeading } from "@/features/admin/components/shared/admin-heading"
import { ADMIN_TABLE } from "@/features/admin/constants"
import { UsersPageWrapper } from "@/features/admin/features/users/components/users-page-wrapper"

export const metadata: Metadata = {
  title: "Users",
  description: "Manage user accounts and roles",
}

export default function UsersPage(props: WithRequiredSearchParams) {
  const {
    heading: { title, description },
    skeleton: { columnsCount, cellWidths },
  } = ADMIN_TABLE.users

  return (
    <>
      <div className="flex items-center justify-between">
        <AdminHeading title={title} description={description} />
      </div>
      <Separator />
      <Suspense
        fallback={
          <DataTableSkeleton
            rowCount={7}
            columnCount={columnsCount}
            cellWidths={cellWidths}
            withCount={false}
            shrinkZero
          />
        }
      >
        <UsersPageWrapper {...props} />
      </Suspense>
    </>
  )
}
