"use client"

import Image from "next/image"

import { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const imageColumn = <T,>(className?: string): ColumnDef<T> => ({
  accessorKey: "image",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="image" />
  ),
  cell: ({ row }) => {
    const image = row.getValue("image") as string
    return (
      <Image
        alt={image}
        src={image}
        width={35}
        height={35}
        quality={100}
        className={cn("ml-2.5 max-w-[45px] object-cover", className)}
        unoptimized
      />
    )
  },
  enableSorting: false,
})
