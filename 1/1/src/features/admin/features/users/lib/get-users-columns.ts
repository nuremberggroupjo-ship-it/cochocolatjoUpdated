"use client"

import { type Dispatch, type SetStateAction } from "react"

import { type ColumnDef } from "@tanstack/react-table"

import { UserAdminData } from "@/types/db"

import {
  actionsColumn,
  createdAtColumn,
  idColumn,
  nameColumn,
  updatedAtColumn,
} from "@/components/shared/data-table/columns"
import { DataTableRowAction } from "@/components/shared/data-table/types"

import { ADMIN_TABLE } from "@/features/admin/constants"
import {
  emailColumn,
  phoneColumn,
  roleColumn,
} from "@/features/admin/features/users/columns"

type GetColumnsProps = {
  setRowAction?: Dispatch<
    SetStateAction<DataTableRowAction<UserAdminData> | null>
  >
  hasDelete?: boolean
}

export function getUsersColumns({
  setRowAction,
  hasDelete = false,
}: GetColumnsProps = {}): ColumnDef<UserAdminData>[] {
  return [
    idColumn<UserAdminData>(),
    nameColumn<UserAdminData>({
      editRoute: ADMIN_TABLE.users.routes.default,
    }),
    emailColumn(),
    phoneColumn(),
    roleColumn(),
    createdAtColumn<UserAdminData>(),
    updatedAtColumn<UserAdminData>(),
    actionsColumn<UserAdminData>({
      setRowAction,
      hasDelete,
      editRoute: ADMIN_TABLE.users.routes.default,
    }),
  ]
}
