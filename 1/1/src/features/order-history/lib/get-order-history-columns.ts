"use client"

import { type ColumnDef } from "@tanstack/react-table"

import type { CustomerOrderData } from "@/types/db"

import {
  createdAtColumn,
  deliveryTypeColumn,
  orderStatusColumn,
  orderTotalPriceColumn,
} from "@/components/shared/data-table/columns"

import {
  orderHistoryActionsColumn,
  orderHistoryItemsColumn,
  orderHistoryNumberColumn,
} from "@/features/order-history/columns"

/**
 * Get customer order history table columns
 * Returns columns optimized for customer view with essential order information
 * Responsive design with mobile-friendly layout
 */
export function getOrderHistoryColumns(): ColumnDef<CustomerOrderData>[] {
  return [
    orderHistoryNumberColumn(),
    createdAtColumn<CustomerOrderData>({
      title: "Order Date",
    }),
    deliveryTypeColumn<CustomerOrderData>(),
    orderStatusColumn<CustomerOrderData>(),
    orderHistoryItemsColumn(),
    orderTotalPriceColumn<CustomerOrderData>(),
    orderHistoryActionsColumn(),
  ]
}
