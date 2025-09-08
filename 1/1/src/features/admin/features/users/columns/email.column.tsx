"use client"

import { ColumnDef } from "@tanstack/react-table"

import type { UserAdminData } from "@/types/db"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const emailColumn = (): ColumnDef<UserAdminData> => ({
  accessorKey: "email",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Email" />
  ),
  cell: ({ row }) => {
    const email = row.getValue("email") as string

    return (
      <a
        href={`mailto:${email}`}
        className="text-primary hover:text-primary/80 block max-w-[200px] truncate underline underline-offset-4 transition-colors"
        title={email}
      >
        {email}
      </a>
    )
  },

  size: 250,
})
