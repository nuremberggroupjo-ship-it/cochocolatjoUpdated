"use client"

import { FC, use, useMemo, useState } from "react"

import { Category } from "@/lib/_generated/prisma"

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
import { deleteCategoryAction } from "@/features/admin/features/categories/actions/delete-category.action"
import { getCategoriesColumns } from "@/features/admin/features/categories/lib/get-categories-columns"
import { type TablesProps } from "@/features/admin/types"

export const CategoriesTable: FC<TablesProps<Category>> = ({ promise }) => {
  const { result } = use(promise)

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<Category> | null>(null)

  const columns = useMemo(() => getCategoriesColumns({ setRowAction }), [])

  const filterField: DataTableFilterField<Category> = {
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
      columnVisibility: { id: false, createdAt: false, slug: false },
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
            tableName="categories"
            deleteAction={deleteCategoryAction}
            deleteActionSuccessRoute={ADMIN_TABLE.categories.routes.default}
          />
        </DataTableToolbar>
      </DataTable>

      <DataTableDeleteAction
        open={rowAction?.type === "delete"}
        tableName="categories"
        showTrigger={false}
        onOpenChange={() => setRowAction(null)}
        selectedRows={rowAction?.row.original ? [rowAction.row.original] : []}
        deleteAction={deleteCategoryAction}
        deleteActionSuccessRoute={ADMIN_TABLE.categories.routes.default}
      />
    </>
  )
}
