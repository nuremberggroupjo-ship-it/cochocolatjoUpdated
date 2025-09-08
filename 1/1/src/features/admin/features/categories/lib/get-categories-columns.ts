"use client"

import { type Dispatch, type SetStateAction } from "react"

import { type ColumnDef } from "@tanstack/react-table"

import { Category } from "@/lib/_generated/prisma"

import {
  actionsColumn,
  createdAtColumn,
  idColumn,
  isActiveColumn,
  nameColumn,
  selectColumn,
  slugColumn,
  updatedAtColumn,
} from "@/components/shared/data-table/columns"
import { DataTableRowAction } from "@/components/shared/data-table/types"

import { ADMIN_TABLE } from "@/features/admin/constants"

type GetColumnsProps = {
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Category> | null>>
}

export function getCategoriesColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<Category>[] {
  return [
    selectColumn<Category>(),
    idColumn<Category>(),
    nameColumn<Category>({
      editRoute: ADMIN_TABLE.categories.routes.default,
    }),
    slugColumn<Category>(),
    createdAtColumn<Category>(),
    updatedAtColumn<Category>(),
    isActiveColumn<Category>(),
    actionsColumn<Category>({
      setRowAction,
      editRoute: ADMIN_TABLE.categories.routes.default,
    }),
  ]
}
