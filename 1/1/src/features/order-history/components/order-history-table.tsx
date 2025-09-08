"use client"

import { FC, use, useMemo } from "react"

import type { CustomerOrderData } from "@/types/db"

import { DataTable } from "@/components/shared/data-table"
import { DataTableToolbar } from "@/components/shared/data-table/components/data-table-toolbar"
import { useDataTable } from "@/components/shared/data-table/hooks/use-data-table"
import { DataTableFilterField } from "@/components/shared/data-table/types"

import { getOrderHistoryColumns } from "@/features//order-history/lib/get-order-history-columns"
import { TablesProps } from "@/features/admin/types"

export const OrderHistoryTable: FC<TablesProps<CustomerOrderData>> = ({
  promise,
}) => {
  const response = use(promise)

  const columns = useMemo(() => getOrderHistoryColumns(), [])

  // Filter field configuration for search functionality
  const filterField: DataTableFilterField<CustomerOrderData> = {
    id: "orderNumber",
    label: "Search Orders",
    placeholder: "Search by order number...",
  }

  // Use empty data for hooks when error occurred
  const data = response.success && response.result ? response.result.data : []
  const pageCount =
    response.success && response.result ? response.result.pageCount : 0

  // Initialize table with customer-specific configuration
  const { table, setPage, isLoading } = useDataTable({
    data,
    pageCount,
    columns,
    filterField,
    debounceMs: 500,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }], // Show newest orders first
      columnVisibility: {
        updatedAt: false,
      },
    },
    getRowId: (originalRow) => originalRow.id,
  })

  // Handle error case after hooks
  if (!response.success || !response.result) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">
          {response.message || "Failed to load orders"}
        </p>
      </div>
    )
  }

  return (
    <DataTable table={table} isLoading={isLoading} className="my-4">
      <DataTableToolbar
        className="p-0"
        setPage={setPage}
        table={table}
        filterField={filterField}
      />
    </DataTable>
  )
}
