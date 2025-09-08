"use client"

import { ColumnDef } from "@tanstack/react-table"

import { ProductData } from "@/types/db"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const stockColumn = (): ColumnDef<ProductData> => ({
  accessorKey: "stock",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Stock" />
  ),
  cell: ({ row }) => <span>{row.getValue("stock")}</span>,
  size: 30,
})
