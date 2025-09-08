"use client"

import { FC, use, useMemo } from "react"

import type { UserAdminData } from "@/types/db"

import { DataTable } from "@/components/shared/data-table"
import { DataTableToolbar } from "@/components/shared/data-table/components/data-table-toolbar"
import { DataTableToolbarActions } from "@/components/shared/data-table/components/data-table-toolbar-actions"
import { useDataTable } from "@/components/shared/data-table/hooks/use-data-table"
import { DataTableFilterField } from "@/components/shared/data-table/types"

import { getUsersColumns } from "@/features/admin/features/users/lib/get-users-columns"
import { type TablesProps } from "@/features/admin/types"

export const UsersTable: FC<TablesProps<UserAdminData>> = ({ promise }) => {
  const { result } = use(promise)

  const columns = useMemo(() => getUsersColumns(), [])

  // Filter field configuration for search functionality
  const filterField: DataTableFilterField<UserAdminData> = {
    id: "name",
    label: "Name",
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
      sorting: [{ id: "updatedAt", desc: true }],
      columnVisibility: { createdAt: false, id: false },
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
          <DataTableToolbarActions table={table} tableName="users" />
        </DataTableToolbar>
      </DataTable>
    </>
  )
}
