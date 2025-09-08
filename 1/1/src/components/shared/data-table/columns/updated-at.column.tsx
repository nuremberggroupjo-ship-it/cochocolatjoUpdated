"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"

import { formatDate } from "@/lib/utils"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

type UpdatedAtColumnProps = {
  title?: string
}

export const updatedAtColumn = <T,>({
  title = "Updated At",
}: UpdatedAtColumnProps = {}): ColumnDef<T> => ({
  accessorKey: "updatedAt",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title={title} />
  ),
  cell: ({ cell }) => {
    const dateValue = cell.getValue<Date>()

    return (
      <div className="flex flex-col">
        <span>{formatDate(dateValue, { hour12: false })}</span>
        <span className="text-muted-foreground text-xs">
          {formatDistanceToNow(dateValue, {
            addSuffix: true,
          })}
        </span>
      </div>
    )
  },
})
