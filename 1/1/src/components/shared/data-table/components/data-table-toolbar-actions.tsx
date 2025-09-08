"use client"

import type { Table } from "@tanstack/react-table"

import { DeleteSafeAction } from "@/types"

import { DataTableDeleteAction } from "@/components/shared/data-table/components/data-table-delete-action"
import { DataTableExportAction } from "@/components/shared/data-table/components/data-table-export-action"

import type { TableName } from "@/features/admin/types"

interface DataTableToolbarActionsProps<T> {
  table: Table<T>
  tableName: TableName
  deleteAction?: DeleteSafeAction
  deleteActionSuccessRoute?: string
}

export function DataTableToolbarActions<T>({
  table,
  tableName,
  deleteAction,
  deleteActionSuccessRoute,
}: DataTableToolbarActionsProps<T>) {
  return (
    <>
      {deleteAction && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DataTableDeleteAction
          selectedRows={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          tableName={tableName}
          deleteAction={deleteAction}
          onDeleteActionSuccess={() => table.toggleAllRowsSelected(false)}
          deleteActionSuccessRoute={deleteActionSuccessRoute}
        />
      ) : null}

      <DataTableExportAction tableName={tableName} />
    </>
  )
}
