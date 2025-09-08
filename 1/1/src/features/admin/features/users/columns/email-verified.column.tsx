"use client"

import { ColumnDef } from "@tanstack/react-table"

import type { UserAdminData } from "@/types/db"

import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

/**
 * Email verification status column for users table
 * Shows verification status with color-coded badges
 * Verified: Success green badge, Unverified: Destructive red badge
 */
export const emailVerifiedColumn = (): ColumnDef<UserAdminData> => ({
  accessorKey: "emailVerified",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Email Status" />
  ),
  cell: ({ row }) => {
    const emailVerified = row.getValue("emailVerified") as boolean

    return (
      <Badge
        variant={emailVerified ? "default" : "destructive"}
        className={
          emailVerified
            ? "bg-success hover:bg-success/80 text-primary-foreground"
            : "bg-destructive hover:bg-destructive/80 text-primary-foreground"
        }
      >
        {emailVerified ? "Verified" : "Unverified"}
      </Badge>
    )
  },

  size: 120,
})
