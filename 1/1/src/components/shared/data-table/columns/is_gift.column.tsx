"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

interface IsGiftColumnOptions {
  isGift: boolean
}

/**
 * Shared isGift column component
 * Shows whether the order was marked as a gift
 */
export function isGiftColumn<T extends IsGiftColumnOptions>(options: { title?: string; size?: number } = {}): ColumnDef<T> {
  const { title = "Gift", size = 80 } = options

  return {
    accessorKey: "isGift",
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => {
      const isGift = row.getValue("isGift") as boolean
      return (
        <span className={isGift ? "text-green-600 font-medium" : "text-muted-foreground"}>
          {isGift ? "🎁 Yes" : "No"}
        </span>
      )
    },
    size,
    enableSorting: true,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  }
}
