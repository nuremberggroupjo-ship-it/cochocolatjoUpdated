"use client"

import { FC, use, useMemo, useState } from "react"

import { Attribute } from "@/lib/_generated/prisma"

import { DataTable } from "@/components/shared/data-table"
import { DataTableDeleteAction } from "@/components/shared/data-table/components/data-table-delete-action"
import { DataTableToolbar } from "@/components/shared/data-table/components/data-table-toolbar"
import { DataTableToolbarActions } from "@/components/shared/data-table/components/data-table-toolbar-actions"
import { useDataTable } from "@/components/shared/data-table/hooks/use-data-table"
import {
  DataTableFilterField,
  DataTableRowAction,
} from "@/components/shared/data-table/types"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { deleteAttributeAction } from "@/features/admin/features/attributes/actions/delete-attribute.action"
import { getAttributesColumns } from "@/features/admin/features/attributes/lib/get-attributes-columns"
import { type TablesProps } from "@/features/admin/types"

export const AttributesTable: FC<TablesProps<Attribute>> = ({ promise }) => {
  const { result } = use(promise)

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<Attribute> | null>(null)

  const columns = useMemo(() => getAttributesColumns({ setRowAction }), [])

  const filterField: DataTableFilterField<Attribute> = {
    id: "name",
    label: "Name",
    placeholder: "Filter names...",
  }

  const { table, setPage, isLoading } = useDataTable({
    data: result?.data || [],
    pageCount: result?.pageCount || 0,
    columns,
    filterField,
    debounceMs: 500,
    initialState: {
      sorting: [{ id: "updatedAt", desc: true }],
      columnVisibility: { createdAt: false, slug: false, id: false },
    },
    getRowId: (originalRow) => originalRow.id.toString(),
  })
  return (
    <>
      <DataTable table={table} isLoading={isLoading}>
        <DataTableToolbar
          setPage={setPage}
          table={table}
          filterField={filterField}
        >
          <DataTableToolbarActions
            table={table}
            tableName="attributes"
            deleteAction={deleteAttributeAction}
            deleteActionSuccessRoute={ADMIN_TABLE.attributes.routes.default}
          />
        </DataTableToolbar>
      </DataTable>

      <DataTableDeleteAction
        open={rowAction?.type === "delete"}
        tableName="attributes"
        showTrigger={false}
        onOpenChange={() => setRowAction(null)}
        selectedRows={rowAction?.row.original ? [rowAction.row.original] : []}
        deleteAction={deleteAttributeAction}
        deleteActionSuccessRoute={ADMIN_TABLE.attributes.routes.default}
      />
    </>
  )
}
