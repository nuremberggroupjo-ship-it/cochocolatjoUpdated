"use client"

import { FC, use, useMemo } from "react"

import type { OrderTableData } from "@/types/db"

import { DataTable } from "@/components/shared/data-table"
import { DataTableToolbar } from "@/components/shared/data-table/components/data-table-toolbar"
import { DataTableToolbarActions } from "@/components/shared/data-table/components/data-table-toolbar-actions"
import { useDataTable } from "@/components/shared/data-table/hooks/use-data-table"
import { DataTableFilterField } from "@/components/shared/data-table/types"

import { getOrdersColumns } from "@/features/admin/features/orders/lib/get-orders-columns"
import { type TablesProps } from "@/features/admin/types"

export const OrdersTable: FC<TablesProps<OrderTableData>> = ({ promise }) => {
  const { result } = use(promise)

  const columns = useMemo(() => getOrdersColumns({}), [])

  // Filter field configuration for search functionality
  const filterField: DataTableFilterField<OrderTableData> = {
    id: "orderNumber",
    label: "Search Orders",
    placeholder: "Search...",
  }

  // Initialize table with proper configuration
  const { table, setPage, isLoading } = useDataTable({
    data: result?.data || [],
    pageCount: result?.pageCount || 0,
    columns,
    filterField,
    debounceMs: 500,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnVisibility: { id: false, updatedAt: false },
    },
    getRowId: (originalRow) => originalRow.id,
  })

  return (
    <>
      <DataTable table={table} isLoading={isLoading}>
        <DataTableToolbar
          setPage={setPage}
          table={table}
          filterField={filterField}
        >
          <DataTableToolbarActions table={table} tableName="orders" />
        </DataTableToolbar>
      </DataTable>
    </>
  )
}
