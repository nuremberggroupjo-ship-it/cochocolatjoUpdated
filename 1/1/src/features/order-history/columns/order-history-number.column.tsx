"use client"

import { ColumnDef } from "@tanstack/react-table"

import type { CustomerOrderData } from "@/types/db"

/**
 * Order Number Column for Customer Order History
 * Displays the order number with a link to view details
 */
export const orderHistoryNumberColumn = (): ColumnDef<CustomerOrderData> => ({
  accessorKey: "orderNumber",
  header: "Order",
  cell: ({ row }) => {
    const orderNumber = row.getValue("orderNumber") as string
    return (
      <span className="font-mono text-sm font-semibold">{orderNumber}</span>
    )
  },
  size: 120,
  enableSorting: true,
})
