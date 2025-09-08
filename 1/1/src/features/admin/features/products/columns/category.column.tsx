"use client"

import Link from "next/link"

import { ColumnDef } from "@tanstack/react-table"
import { ExternalLinkIcon } from "lucide-react"

import { ProductData } from "@/types/db"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"
import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const categoryColumn = (): ColumnDef<ProductData> => ({
  accessorKey: "category",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Category" />
  ),
  cell: ({ row }) => {
    const category = row.getValue("category") as ProductData["category"]
    return (
      <div className="flex items-center gap-1">
        <h2 className="block max-w-[25rem] truncate transition-all duration-200">
          {category.name}
        </h2>
        <ButtonWithTooltip
          className="size-6"
          tooltipContent={`View "${category.name}" details`}
        >
          <Link href={`categories/${category.slug}`}>
            <span className="sr-only">View {category.name} details</span>
            <ExternalLinkIcon className="h-3 w-3" />
          </Link>
        </ButtonWithTooltip>
      </div>
    )
  },

  size: 30,
})
