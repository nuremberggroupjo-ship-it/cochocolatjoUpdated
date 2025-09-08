"use client"

import { type Dispatch, type SetStateAction } from "react"

import { type ColumnDef } from "@tanstack/react-table"

import type { OrderTableData } from "@/types/db"

import {
  actionsColumn,
  createdAtColumn,
  deliveryTypeColumn,
  orderStatusColumn,
  orderTotalPriceColumn,
  updatedAtColumn,
} from "@/components/shared/data-table/columns"
import { DataTableRowAction } from "@/components/shared/data-table/types"

import { ADMIN_TABLE } from "@/features/admin/constants"
import {
  customerColumn,
  orderNumberColumn,
  paymentColumn,
} from "@/features/admin/features/orders/columns"

type GetColumnsProps = {
  setRowAction?: Dispatch<
    SetStateAction<DataTableRowAction<OrderTableData> | null>
  >
  hasDelete?: boolean
}

/**
 * Get orders table columns with all necessary information
 * Includes order number, customer, status, payment, total, and date
 * No delete functionality as requested - only edit actions
 */
export function getOrdersColumns({
  setRowAction,
  hasDelete = false,
}: GetColumnsProps = {}): ColumnDef<OrderTableData>[] {
  return [
    orderNumberColumn(),
    customerColumn(),
    orderStatusColumn<OrderTableData>(),
    paymentColumn(),
    deliveryTypeColumn<OrderTableData>(),
    orderTotalPriceColumn<OrderTableData>(),
    createdAtColumn<OrderTableData>({ title: "Order Date" }),
    updatedAtColumn<OrderTableData>(),
    // Actions column without delete functionality
    actionsColumn<OrderTableData>({
      setRowAction,
      hasDelete, // No delete for orders as requested
      editRoute: ADMIN_TABLE.orders.routes.default,
    }),
  ]
}
