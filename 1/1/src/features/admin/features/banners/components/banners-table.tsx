"use client"

import { FC, use, useMemo, useState } from "react"

import { Banner } from "@/lib/_generated/prisma"

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
import { deleteBannerAction } from "@/features/admin/features/banners/actions/delete-banner.action"
import { getBannersColumns } from "@/features/admin/features/banners/lib/get-banners-columns"
import { type TablesProps } from "@/features/admin/types"

export const BannersTable: FC<TablesProps<Banner>> = ({ promise }) => {
  const { result } = use(promise)

  const [rowAction, setRowAction] = useState<DataTableRowAction<Banner> | null>(
    null,
  )

  const columns = useMemo(() => getBannersColumns({ setRowAction }), [])

  const filterField: DataTableFilterField<Banner> = {
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
            tableName="banners"
            deleteAction={deleteBannerAction}
            deleteActionSuccessRoute={ADMIN_TABLE.banners.routes.default}
          />
        </DataTableToolbar>
      </DataTable>

      <DataTableDeleteAction
        open={rowAction?.type === "delete"}
        tableName="banners"
        showTrigger={false}
        onOpenChange={() => setRowAction(null)}
        selectedRows={rowAction?.row.original ? [rowAction.row.original] : []}
        deleteAction={deleteBannerAction}
        deleteActionSuccessRoute={ADMIN_TABLE.banners.routes.default}
      />
    </>
  )
}
