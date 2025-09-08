import { type Metadata } from "next"
import { Suspense } from "react"

import { type WithRequiredSearchParams } from "@/types"

import { Separator } from "@/components/ui/separator"

import { DataTableSkeleton } from "@/components/shared/data-table/components/data-table-skeleton"

import { AddItemButton } from "@/features/admin/components/shared/add-item-button"
import { AdminHeading } from "@/features/admin/components/shared/admin-heading"
import { ADMIN_TABLE } from "@/features/admin/constants"
import { BannersPageWrapper } from "@/features/admin/features/banners/components/banners-page-wrapper"

export const metadata: Metadata = {
  title: "Banners",
  description: "Manage promotional banners and their details",
}

export default function BannersPage(props: WithRequiredSearchParams) {
  const {
    routes,
    heading: { title, description },
    skeleton: { columnsCount, cellWidths },
  } = ADMIN_TABLE.banners

  return (
    <>
      <div className="flex items-center justify-between">
        <AdminHeading title={title} description={description} />
        <AddItemButton href={routes.new} />
      </div>
      <Separator className="bg-border/80" />
      <Suspense
        fallback={
          <DataTableSkeleton
            rowCount={7}
            columnCount={columnsCount}
            cellWidths={cellWidths}
            shrinkZero
          />
        }
      >
        <BannersPageWrapper searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
