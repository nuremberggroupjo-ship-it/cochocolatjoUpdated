"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const idColumn = <T,>(): ColumnDef<T> => ({
  accessorKey: "id",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
  cell: ({ row }) => <span>{row.getValue("id")}</span>,
  enableHiding: true,
  size: 30,
})
