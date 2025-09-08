"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const priorityColumn = <T,>(): ColumnDef<T> => ({
  accessorKey: "priority",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Priority" />
  ),
  cell: ({ row }) => <span>{row.getValue("priority")}</span>,

  size: 30,
})
