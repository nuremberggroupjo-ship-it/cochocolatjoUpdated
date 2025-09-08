"use client"

import { type Dispatch, type SetStateAction } from "react"

import { type ColumnDef } from "@tanstack/react-table"

import { Attribute } from "@/lib/_generated/prisma"

import {
  actionsColumn,
  createdAtColumn,
  idColumn,
  imageColumn,
  nameColumn,
  selectColumn,
  slugColumn,
  updatedAtColumn,
} from "@/components/shared/data-table/columns"
import { DataTableRowAction } from "@/components/shared/data-table/types"

import { ADMIN_TABLE } from "@/features/admin/constants"

type GetColumnsProps = {
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Attribute> | null>>
}

export function getAttributesColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<Attribute>[] {
  return [
    selectColumn<Attribute>(),
    idColumn<Attribute>(),
    nameColumn<Attribute>({
      editRoute: ADMIN_TABLE.attributes.routes.default,
    }),
    imageColumn<Attribute>(),
    slugColumn<Attribute>(),
    createdAtColumn<Attribute>(),
    updatedAtColumn<Attribute>(),
    actionsColumn<Attribute>({
      setRowAction,
      editRoute: ADMIN_TABLE.attributes.routes.default,
    }),
  ]
}
