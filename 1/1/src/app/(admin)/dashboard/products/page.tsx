import { type Metadata } from "next"
import { Suspense } from "react"

import { type WithRequiredSearchParams } from "@/types"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

import { DataTableSkeleton } from "@/components/shared/data-table/components/data-table-skeleton"

import { AddItemButton } from "@/features/admin/components/shared/add-item-button"
import { AdminHeading } from "@/features/admin/components/shared/admin-heading"
import { ADMIN_TABLE } from "@/features/admin/constants"
import { ProductsPageWrapper } from "@/features/admin/features/products/components/products-page-wrapper"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage products and their details",
}

export default function ProductsPage(props: WithRequiredSearchParams) {
  const {
    routes,
    heading: { title, description },
    skeleton: { columnsCount, cellWidths },
  } = ADMIN_TABLE.products

  return (
    <>
      <div className="flex items-center justify-between">
        <AdminHeading title={title} description={description} />
        <div className="flex items-center justify-between gap-2">
          <AddItemButton href={routes.new} />
        <Button>
  <Link
    href="/products/sort"
    className="flex items-center gap-2 justify-center w-auto"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      className="bi bi-filter"
      viewBox="0 0 16 16"
    >
      <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
    </svg>
    <span className="hidden sm:inline text-sm capitalize md:text-base">
      Sort
    </span>
  </Link>
</Button>
        </div>
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
        <ProductsPageWrapper searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
