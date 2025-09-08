"use client"

import Link from "next/link"

import { ColumnDef } from "@tanstack/react-table"
import { ExternalLinkIcon } from "lucide-react"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"
import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

interface SlugType {
  slug: string
}
interface IdType {
  id: string
}

type NameColumnProps = {
  editRoute: string
}



export const nameColumn = <T extends SlugType | IdType>({
  editRoute,
}: NameColumnProps): ColumnDef<T> => ({
  accessorKey: "name",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Name" />
  ),
  cell: function ({ row }) {
    const name = row.getValue("name") as string
    return (
      <div className="flex items-center gap-1">
        <h2 className="block max-w-[25rem] truncate transition-all duration-200">
          {name}
        </h2>
        <ButtonWithTooltip
          className="size-6"
          tooltipContent={`View "${name}" profile`}
        >
          <Link
            href={`${editRoute}/${"slug" in row.original ? row.original.slug : row.original.id}`}
          >
            <span className="sr-only">View {name} profile</span>
            <ExternalLinkIcon className="h-3 w-3" />
          </Link>
        </ButtonWithTooltip>
      </div>
    )
  },
})
