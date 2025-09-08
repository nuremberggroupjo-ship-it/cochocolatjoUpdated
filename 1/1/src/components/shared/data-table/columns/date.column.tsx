"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

interface DateColumnOptions {
  date: string | null
}

/**
 * Shared date column component
 * Shows the selected delivery date (if any)
 */
export function dateColumn<T extends DateColumnOptions>(options: { title?: string; size?: number } = {}): ColumnDef<T> {
  const { title = "Delivery Date", size = 160 } = options

  return {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => {
      const dateValue = row.getValue("date") as string | null
      if (!dateValue) return <span className="text-muted-foreground">—</span>

      return <span>{format(new Date(dateValue), "PP")}</span>
    },
    size,
    enableSorting: true,
  }
}
