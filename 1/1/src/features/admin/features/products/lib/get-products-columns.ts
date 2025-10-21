"use client"

import { type Dispatch, type SetStateAction } from "react"

import { type ColumnDef } from "@tanstack/react-table"

import { type ProductData } from "@/types/db"

import {
  actionsColumn,
  createdAtColumn,
  idColumn,
  isActiveColumn,
  isFeaturedColumn,
  nameColumn,
  selectColumn,
  slugColumn,
  updatedAtColumn,
} from "@/components/shared/data-table/columns"
import { DataTableRowAction } from "@/components/shared/data-table/types"

import { ADMIN_TABLE } from "@/features/admin/constants"
import {
  categoryColumn,
  stockColumn,
} from "@/features/admin/features/products/columns"

type GetColumnsProps = {
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<ProductData> | null>>
}

export function getProductsColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<ProductData>[] {
  return [
    selectColumn<ProductData>(),
    idColumn<ProductData>(),
    nameColumn<ProductData>({
      editRoute: ADMIN_TABLE.products.routes.default,
    }),
    // productImageColumn(),
    categoryColumn(),
    stockColumn(),
    slugColumn<ProductData>(),
    createdAtColumn<ProductData>(),
    updatedAtColumn<ProductData>(),
    isFeaturedColumn<ProductData>(),
    isActiveColumn<ProductData>(),
    {
      id: "size",
      accessorKey: "size",
      header: "Size",
      enableHiding: true,
    },
    {
      id: "unit",
      accessorKey: "unit",
      header: "Unit",
      enableHiding: true,
    },
    actionsColumn<ProductData>({
      setRowAction,
      editRoute: ADMIN_TABLE.products.routes.default,
    }),
  ]
}
