"use client"

import Link from "next/link"

import { ColumnDef } from "@tanstack/react-table"
import { EyeIcon } from "lucide-react"

import type { CustomerOrderData } from "@/types/db"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"

/**
 * Order Actions Column for Customer Order History
 * Provides action buttons for viewing order details
 */
export const orderHistoryActionsColumn = (): ColumnDef<CustomerOrderData> => ({
  id: "actions",
  header: "",
  cell: ({ row }) => {
    const order = row.original

    return (
      <div className="flex items-center justify-end gap-2">
        <ButtonWithTooltip
          size="sm"
          variant="outline"
          tooltipContent="View order details"
          className="h-8 w-8 p-0"
          asChild
        >
          <Link href={`/order-history/${order.orderNumber}`}>
            <EyeIcon className="h-4 w-4" />
            <span className="sr-only">View order #{order.orderNumber}</span>
          </Link>
        </ButtonWithTooltip>
      </div>
    )
  },
  size: 60,
  enableSorting: false,
})
