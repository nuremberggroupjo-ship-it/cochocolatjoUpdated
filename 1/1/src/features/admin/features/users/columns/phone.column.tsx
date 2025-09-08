"use client"

import { ColumnDef } from "@tanstack/react-table"

import type { UserAdminData } from "@/types/db"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

/**
 * Phone column component for users table
 * Displays phone number as clickable tel: link for quick calling
 * Shows "No phone" placeholder when phone is not available
 */
export const phoneColumn = (): ColumnDef<UserAdminData> => ({
  accessorKey: "phone",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Phone" />
  ),
  cell: ({ row }) => {
    const phone = row.getValue("phone") as string | null

    if (!phone) {
      return <span className="text-muted-foreground text-sm">No phone</span>
    }

    return (
      <a
        href={`tel:${phone}`}
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        title={`Call ${phone}`}
      >
        {phone}
      </a>
    )
  },

  size: 150,
})
