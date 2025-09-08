"use client"

import { ColumnDef } from "@tanstack/react-table"

import type { UserAdminData } from "@/types/db"

import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

/**
 * Role column component for users table
 * Displays user role with colored badges for better visual distinction
 * ADMIN: Primary blue badge, USER: Secondary gray badge
 */
export const roleColumn = (): ColumnDef<UserAdminData> => ({
  accessorKey: "role",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Role" />
  ),
  cell: ({ row }) => {
    const role = row.getValue("role") as UserAdminData["role"]

    return (
      <Badge variant={role === "ADMIN" ? "gradientDestructive" : "outline"}>
        {role}
      </Badge>
    )
  },

  size: 80,
})
