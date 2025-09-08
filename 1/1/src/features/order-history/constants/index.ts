import {
  SHARED_ORDER_STATUS_OPTIONS,
  CUSTOMER_ORDER_UTILS as SharedCustomerOrderUtils,
} from "@/lib/shared/order-utils"

/**
 * Customer order history configuration
 */
export const CUSTOMER_ORDER_HISTORY = {
  heading: {
    title: "Order History",
    description: "View and track your orders",
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50] as const,
  },
  skeleton: {
    columnsCount: 6,
    cellWidths: ["6rem", "6rem", "4rem", "4rem", "6rem", "3rem"] as const,
  },
} as const

/**
 * Customer-facing order status options with display labels and colors
 * Uses shared status options with customer-friendly descriptions
 */
export const CUSTOMER_ORDER_STATUS_OPTIONS = SHARED_ORDER_STATUS_OPTIONS.map(
  (option) => ({
    value: option.value,
    label: option.label,
    color: option.color,
    description: option.customerDescription,
  }),
)

/**
 * Helper functions for customer order utilities
 * Uses shared utilities with customer-specific enhancements
 */
export const CUSTOMER_ORDER_UTILS = SharedCustomerOrderUtils
