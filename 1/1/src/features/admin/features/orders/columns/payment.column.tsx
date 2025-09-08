"use client"

import { ColumnDef } from "@tanstack/react-table"

import type { OrderTableData } from "@/types/db"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

import { ORDER_UTILS } from "@/features/admin/features/orders/constants"

/**
 * Payment method and status column
 * Shows payment method with payment status indicator
 */
export const paymentColumn = (): ColumnDef<OrderTableData> => ({
  id: "payment",
  accessorFn: (row) => row.paymentMethod,
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Payment" />
  ),
  cell: ({ row }) => {
    const paymentMethod = row.original.paymentMethod
    const isPaid = row.original.isPaid
    const paymentOption = ORDER_UTILS.getPaymentMethodOption(paymentMethod)

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {paymentOption?.shortLabel || paymentMethod}
          </span>
          {paymentOption?.icon && (
            <span className="text-sm">{paymentOption.icon}</span>
          )}
        </div>
        <Badge
          variant={isPaid ? "default" : "destructive"}
          className={cn(
            "w-fit text-xs",
            isPaid
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
          )}
        >
          {isPaid ? "Paid" : "Unpaid"}
        </Badge>
      </div>
    )
  },
  size: 120,
  enableSorting: false,
})
