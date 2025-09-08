"use client"

import * as React from "react"

import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableDateRangePicker } from "@/components/shared/data-table/components/data-table-date-range-picker"
import { DataTableViewOptions } from "@/components/shared/data-table/components/data-table-view-options"
import type { DataTableFilterField } from "@/components/shared/data-table/types"

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  filterField?: DataTableFilterField<TData>
  setPage: (page: number) => void // Add setPage prop
}

export function DataTableToolbar<TData>({
  table,
  filterField,
  className,
  children,
  setPage,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-start gap-2">
        {filterField && (
          <Input
            key={String(filterField.id)}
            placeholder={filterField.placeholder}
            value={
              (table
                .getColumn(String(filterField.id))
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(String(filterField.id))
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-40 text-sm lg:w-64"
          />
        )}

        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            <span className="hidden md:flex">Reset</span>
            <X className="ml-0 size-4 md:ml-2" aria-hidden="true" />
          </Button>
        )}

        <DataTableDateRangePicker
          triggerSize="sm"
          triggerClassName="w-auto md:min-w-56"
          align="center"
          shallow={false}
          setPage={setPage}
        />
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
