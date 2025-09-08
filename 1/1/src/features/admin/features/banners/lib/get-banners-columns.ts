"use client"

import { type Dispatch, type SetStateAction } from "react"

import { type ColumnDef } from "@tanstack/react-table"

import { Banner } from "@/lib/_generated/prisma"

import {
  actionsColumn,
  createdAtColumn,
  idColumn,
  isActiveColumn,
  nameColumn,
  priorityColumn,
  selectColumn,
  slugColumn,
  updatedAtColumn,
} from "@/components/shared/data-table/columns"
import { DataTableRowAction } from "@/components/shared/data-table/types"

import { ADMIN_TABLE } from "@/features/admin/constants"

type GetColumnsProps = {
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Banner> | null>>
}

export function getBannersColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<Banner>[] {
  return [
    selectColumn<Banner>(),
    idColumn<Banner>(),
    nameColumn<Banner>({
      editRoute: ADMIN_TABLE.banners.routes.default,
    }),
    slugColumn<Banner>(),
    createdAtColumn<Banner>(),
    updatedAtColumn<Banner>(),
    priorityColumn<Banner>(),

    isActiveColumn<Banner>(),
    actionsColumn<Banner>({
      setRowAction,
      editRoute: ADMIN_TABLE.banners.routes.default,
    }),
  ]
}
