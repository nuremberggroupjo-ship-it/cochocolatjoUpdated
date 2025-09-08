"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const isActiveColumn = <T,>(): ColumnDef<T> => ({
  accessorKey: "isActive",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Is Active" />
  ),
  cell: ({ row }) => {
    const isActive = row.getValue("isActive") as boolean
    return (
      <Badge variant={isActive ? "success" : "destructive"}>
        {isActive ? "Yes" : "No"}
      </Badge>
    )
  },

  size: 20,
})
