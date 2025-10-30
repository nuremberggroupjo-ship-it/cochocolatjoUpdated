"use client"

import Link from "next/link"

import { ColumnDef } from "@tanstack/react-table"
import { ExternalLinkIcon } from "lucide-react"

import type { OrderTableData } from "@/types/db"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"
import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const orderNumberColumn = (): ColumnDef<OrderTableData> => ({
  accessorKey: "orderNumber",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Order #" />
  ),
  cell: ({ row }) => {
    const orderNumber = row.getValue("orderNumber") as string
    const orderId = row.original.id
    const is_gift = !!(row.original as OrderTableData).is_gift


    return (
      <div className="flex items-center gap-1">
        {is_gift&& <code className="font-mono text-sm text-red-500">{orderNumber}</code>}
        {!is_gift&& <code className="font-mono text-sm">{orderNumber}</code>}

        <ButtonWithTooltip
          className="size-6"
          tooltipContent={`View order details`}
        >
          <Link href={`/dashboard/orders/${orderId}`}>
            <span className="sr-only">View order details</span>
            <ExternalLinkIcon className="h-3 w-3" />
          </Link>
        </ButtonWithTooltip>
      </div>
    )
  },
  size: 150,
  enableSorting: true,
})
