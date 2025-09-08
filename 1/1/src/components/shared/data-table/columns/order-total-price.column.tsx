"use client"

import { Decimal } from "@prisma/client/runtime/library"
import { ColumnDef } from "@tanstack/react-table"

import { SHARED_ORDER_UTILS } from "@/lib/shared/order-utils"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

interface OrderTotalPriceColumnOptions {
  totalPrice: string | number | Decimal
}

/**
 * Shared order total price column component
 * Can be used by both admin and customer tables
 */
export function orderTotalPriceColumn<T extends OrderTotalPriceColumnOptions>(
  options: {
    title?: string
    size?: number
  } = {},
): ColumnDef<T> {
  const { title = "Total", size = 120 } = options

  return {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const totalPrice = row.getValue("totalPrice") as string | number | Decimal
      return (
        <span className="font-medium">
          {SHARED_ORDER_UTILS.formatPrice(totalPrice)}
        </span>
      )
    },
    size,
    enableSorting: true,
  }
}
