"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const isFeaturedColumn = <T,>(): ColumnDef<T> => ({
  accessorKey: "isFeatured",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Is Featured" />
  ),
  cell: ({ row }) => {
    const isFeatured = row.getValue("isFeatured") as boolean

    return (
      <Badge variant={isFeatured ? "success" : "destructive"}>
        {isFeatured ? "Yes" : "No"}
      </Badge>
    )
  },
  size: 20,
})
