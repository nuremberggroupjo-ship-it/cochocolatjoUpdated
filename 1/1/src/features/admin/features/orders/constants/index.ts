import {
  ADMIN_ORDER_UTILS,
  ORDER_STATUS_FLOW,
  SHARED_DELIVERY_TYPE_OPTIONS,
  SHARED_ORDER_STATUS_OPTIONS,
  SHARED_PAYMENT_METHOD_OPTIONS,
} from "@/lib/shared/order-utils"

// Re-export shared constants for admin use
export const ORDER_STATUS_OPTIONS = SHARED_ORDER_STATUS_OPTIONS
export const PAYMENT_METHOD_OPTIONS = SHARED_PAYMENT_METHOD_OPTIONS
export const DELIVERY_TYPE_OPTIONS = SHARED_DELIVERY_TYPE_OPTIONS
export { ORDER_STATUS_FLOW }

// Use shared utilities with admin-specific naming for backward compatibility
export const ORDER_UTILS = ADMIN_ORDER_UTILS
