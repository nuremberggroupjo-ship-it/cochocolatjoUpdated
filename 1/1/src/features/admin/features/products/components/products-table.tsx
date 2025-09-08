"use client"

import { FC, use, useMemo, useState } from "react"

import { type ProductData } from "@/types/db"

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
import { deleteProductAction } from "@/features/admin/features/products/actions/delete-product.action"
import { getProductsColumns } from "@/features/admin/features/products/lib/get-products-columns"
import { type TablesProps } from "@/features/admin/types"

export const ProductsTable: FC<TablesProps<ProductData>> = ({ promise }) => {
  const { result } = use(promise)

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<ProductData> | null>(null)

  const columns = useMemo(() => getProductsColumns({ setRowAction }), [])

  const filterField: DataTableFilterField<ProductData> = {
    id: "name",
    label: "Name",
    placeholder: "Filter names or categories...",
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
            tableName="products"
            deleteAction={deleteProductAction}
            deleteActionSuccessRoute={ADMIN_TABLE.products.routes.default}
          />
        </DataTableToolbar>
      </DataTable>

      <DataTableDeleteAction
        open={rowAction?.type === "delete"}
        tableName="products"
        showTrigger={false}
        onOpenChange={() => setRowAction(null)}
        selectedRows={rowAction?.row.original ? [rowAction.row.original] : []}
        deleteAction={deleteProductAction}
        deleteActionSuccessRoute={ADMIN_TABLE.products.routes.default}
      />
    </>
  )
}
