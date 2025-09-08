"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"

import { formatDate } from "@/lib/utils"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

type CreatedAtColumnProps = {
  title?: string
}

export const createdAtColumn = <T,>({
  title = "Created At",
}: CreatedAtColumnProps = {}): ColumnDef<T> => ({
  accessorKey: "createdAt",
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
