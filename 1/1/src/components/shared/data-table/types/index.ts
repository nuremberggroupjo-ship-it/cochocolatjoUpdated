import { ColumnSort, Row } from "@tanstack/react-table"

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: "update" | "delete"
}

export type StringKeyOf<TData> = Extract<keyof TData, string>

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>
  label: string
  placeholder?: string
}

// Table Sorting
export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: StringKeyOf<TData>
}
export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]
