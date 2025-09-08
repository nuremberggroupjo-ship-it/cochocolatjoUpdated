"use client"

import { ColumnDef } from "@tanstack/react-table"

import { OrderStatus } from "@/lib/_generated/prisma"
import { SHARED_ORDER_UTILS } from "@/lib/shared/order-utils"

import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

interface OrderStatusColumnOptions {
  status: OrderStatus
}

/**
 * Shared order status column component
 * Can be used by both admin and customer tables
 */
export function orderStatusColumn<T extends OrderStatusColumnOptions>(
  options: {
    title?: string
    size?: number
  } = {},
): ColumnDef<T> {
  const { title = "Status", size = 120 } = options

  return {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus
      const statusOption = SHARED_ORDER_UTILS.getStatusOption(status)

      if (!statusOption) {
        return <span className="text-muted-foreground">Unknown</span>
      }

      return (
        <Badge
          variant="secondary"
          className={`${statusOption.color} font-medium`}
        >
          {statusOption.label}
        </Badge>
      )
    },
    size,
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  }
}
