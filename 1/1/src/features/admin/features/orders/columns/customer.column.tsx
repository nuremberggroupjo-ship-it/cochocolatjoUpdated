"use client"

import Link from "next/link"

import { ColumnDef } from "@tanstack/react-table"
import { ExternalLinkIcon } from "lucide-react"

import type { OrderTableData } from "@/types/db"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"
import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

import { ORDER_UTILS } from "@/features/admin/features/orders/constants"

export const customerColumn = (): ColumnDef<OrderTableData> => ({
  id: "customer",
  accessorFn: (row) => ORDER_UTILS.getCustomerDisplayName(row),
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Customer" />
  ),
  cell: ({ row }) => {
    const customerName = ORDER_UTILS.getCustomerDisplayName(row.original)
    const customerEmail = ORDER_UTILS.getCustomerEmail(row.original)
    const user = row.original.user

    return (
      <div className="flex flex-col gap-1">
        {user ? (
          <div className="flex items-center gap-1">
            <p className="max-w-[300px] truncate">{customerName}</p>
            <ButtonWithTooltip
              className="size-6"
              tooltipContent={`View ${customerName} profile`}
            >
              <Link href={`/dashboard/users/${user.id}`}>
                <span className="sr-only">View {customerName} profile</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </Link>
            </ButtonWithTooltip>
          </div>
        ) : (
          <span className="text-muted-foreground font-medium">
            {customerName}
          </span>
        )}
        <span className="text-muted-foreground max-w-[200px] truncate text-xs">
          {customerEmail}
        </span>
      </div>
    )
  },
  size: 200,
  enableSorting: false,
})
