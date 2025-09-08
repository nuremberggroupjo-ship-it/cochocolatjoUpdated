"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const slugColumn = <T,>(): ColumnDef<T> => ({
  accessorKey: "slug",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Slug" />
  ),
  cell: ({ row }) => {
    const slug = row.getValue("slug") as string
    return (
      <span className="block max-w-[20rem] truncate font-medium">{slug}</span>
    )
  },
})
