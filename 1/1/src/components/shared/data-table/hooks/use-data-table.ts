"use client"

import { useCallback, useMemo, useState, useTransition } from "react"

import {
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  type UseQueryStateOptions,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import { useDebouncedCallback } from "use-debounce"

import {
  DataTableFilterField,
  ExtendedSortingState,
} from "@/components/shared/data-table/types"

import { getSortingStateParser } from "@/features/admin/lib/get-sorting-state-parser"

// Define the type for query state options, excluding the `parse` function
type QueryStateOption = Omit<UseQueryStateOptions<string>, "parse">

// Define the props for the `useDataTable` hook
interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      "getCoreRowModel" | "pageCount" | "manualPagination"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  filterField: DataTableFilterField<TData> // The field used for filtering
  history?: "push" | "replace" // How query updates affect browser history
  scroll?: boolean // Whether to scroll to the top on URL changes
  shallow?: boolean // Whether to keep query states client-side
  debounceMs?: number // Debounce time for filter updates
  clearOnDefault?: boolean // Whether to clear URL query keys when state is reset
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedSortingState<TData> // Initial sorting state
  }
}

/**
 * A custom hook to manage state for a data table with filtering, sorting, pagination, and more.
 * It integrates with URL query parameters for persistent state across page reloads.
 *
 * @param {UseDataTableProps<TData>} props - Configuration options for the table.
 * @returns An object containing the table instance and a function to set the current page.
 */
export function useDataTable<TData>({
  pageCount = -1,
  history = "replace",
  filterField,
  scroll = false,
  shallow = false,
  clearOnDefault = true,
  initialState,
  debounceMs = 300,
  ...props
}: UseDataTableProps<TData>) {
  const [isPending, startTransition] = useTransition()

  // Memoize query state options to avoid unnecessary recalculations
  const queryStateOptions = useMemo<QueryStateOption>(
    () => ({ history, scroll, shallow, clearOnDefault }),
    [history, scroll, shallow, clearOnDefault],
  )

  // State for row selection
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  )

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {},
  )

  // State for the filter value, synced with the URL
  const [filterValue, setFilterValue] = useQueryState(
    filterField?.id,
    parseAsString.withOptions(queryStateOptions),
  )

  // Debounced function to update the filter value in the URL
  const debouncedSetFilterValue = useDebouncedCallback(
    (value: typeof filterValue) => {
      startTransition(() => {
        void setPage(1) // Reset to the first page when the filter changes
        void setFilterValue(value)
      })
    },
    debounceMs,
  )

  // Initialize column filters based on the filter value
  const initialColumnFilters = useMemo<ColumnFiltersState>(() => {
    if (filterValue) {
      return [
        {
          id: filterField.id, // The ID of the filter field (e.g., "name")
          value: [filterValue], // Ensure the value is an array
        },
      ]
    }
    return [] // Return an empty array if no filter value is set
  }, [filterValue, filterField.id])

  // State for column filters
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters)

  // Callback to handle changes to column filters
  const onColumnFiltersChange = useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue

        // Find the filter value for the specified field
        const selectedFilter = next.find(
          (filter) => filter.id === filterField.id,
        )
        const newFilterValue = selectedFilter
          ? (selectedFilter.value as string)
          : null

        // Update the URL with the new filter value
        debouncedSetFilterValue(newFilterValue)

        return next
      })
    },
    [debouncedSetFilterValue, filterField.id],
  )

  // State for sorting, synced with the URL
  const [sorting, setSorting] = useQueryState(
    "sort",
    getSortingStateParser<TData>()
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? []),
  )

  // Callback to handle changes to sorting
  const onSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        const newSorting = updaterOrValue(
          sorting,
        ) as ExtendedSortingState<TData>
        void setSorting(newSorting)
      }
    },
    [sorting, setSorting],
  )

  // State for pagination, synced with the URL
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withOptions(queryStateOptions).withDefault(1),
  )

  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 10),
  )

  // Memoized pagination state
  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: page - 1, // Convert to zero-based index
      pageSize: perPage,
    }),
    [page, perPage],
  )

  // Callback to handle changes to pagination
  const onPaginationChange = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      startTransition(() => {
        if (typeof updaterOrValue === "function") {
          const newPagination = updaterOrValue(pagination)
          void setPage(newPagination.pageIndex + 1) // Convert back to one-based index
          void setPerPage(newPagination.pageSize)
        } else {
          void setPage(updaterOrValue.pageIndex + 1)
          void setPerPage(updaterOrValue.pageSize)
        }
      })
    },
    [pagination, setPage, setPerPage],
  )

  // Create the table instance using `useReactTable`
  const table = useReactTable({
    ...props,
    initialState: {
      columnPinning: { right: ["actions"] },
      ...initialState,
    },
    pageCount,
    state: {
      pagination: {
      pageIndex: 0, 
      pageSize: 50, 
    },
      columnVisibility,
      sorting,
      rowSelection,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange,
    manualFiltering: true,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange,
    manualSorting: true,
    getSortedRowModel: getSortedRowModel(),
  })

  // Return the table instance and a function to set the current page
  return { table, setPage, isLoading: isPending }
}
