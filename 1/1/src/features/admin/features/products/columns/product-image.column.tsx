"use client"

import Image from "next/image"

import { ColumnDef } from "@tanstack/react-table"

import { ProductData } from "@/types/db"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

export const productImageColumn = (): ColumnDef<ProductData> => ({
  accessorKey: "productImages",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="image" />
  ),
  cell: ({ cell }) => {
    const productImages = cell.getValue() as ProductData["productImages"]

    const image = productImages?.[0]?.imageUrl
    return (
      <Image
        alt={image}
        src={image}
        width={35}
        height={35}
        quality={100}
        className={"ml-2.5 size-auto max-w-[45px] object-cover"}
      />
    )
  },
  enableSorting: false,
})
