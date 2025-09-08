"use client"

import { ColumnDef } from "@tanstack/react-table"

import type { CustomerOrderData } from "@/types/db"

/**
 * Order Items Count Column for Customer Order History
 * Displays the number of items in the order and delivery type
 */
export const orderHistoryItemsColumn = (): ColumnDef<CustomerOrderData> => ({
  accessorKey: "items",
  header: "Items",
  cell: ({ row }) => {
    const itemCount = row.original._count.orderItems

    return (
      <span className="text-sm font-medium">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </span>
    )
  },
  size: 100,
  enableSorting: false,
})
