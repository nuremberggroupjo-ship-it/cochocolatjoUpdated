import {
  DeliveryType,
  OrderStatus,
  PaymentMethod,
} from "@/lib/_generated/prisma"

/**
 * Shared order status options with display labels and colors
 * Used by both admin and customer interfaces
 */
export const SHARED_ORDER_STATUS_OPTIONS = [
  {
    value: OrderStatus.PENDING,
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    description: "Order is waiting to be processed",
    customerDescription: "Your order is being processed",
  },
  {
    value: OrderStatus.PROCESSING,
    label: "Processing",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    description: "Order is being prepared",
    customerDescription: "Your order is being prepared",
  },
  {
    value: OrderStatus.SHIPPED,
    label: "Shipped",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    description: "Order has been shipped",
    customerDescription: "Your order is on the way",
  },
  {
    value: OrderStatus.DELIVERED,
    label: "Delivered",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    description: "Order has been delivered to customer",
    customerDescription: "Your order has been delivered",
  },
  {
    value: OrderStatus.CANCELLED,
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    description: "Order has been cancelled",
    customerDescription: "Your order was cancelled",
  },
  {
    value: OrderStatus.REFUNDED,
    label: "Refunded",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    description: "Order has been refunded",
    customerDescription: "Your order was refunded",
  },
] as const

/**
 * Shared payment method options with display labels and icons
 */
export const SHARED_PAYMENT_METHOD_OPTIONS = [
  {
    value: PaymentMethod.CASH_ON_DELIVERY,
    label: "Cash on Delivery",
    shortLabel: "COD",
    icon: "💰",
    description: "Pay when you receive your order",
  },
  {
    value: PaymentMethod.VISA,
    label: "Visa Card",
    shortLabel: "VISA",
    icon: "💳",
    description: "Pay online with Visa card",
  },
  {
    value: PaymentMethod.CLIQ,
    label: "CLIQ",
    shortLabel: "CLIQ",
    icon: "📱",
    description: "Pay using CLIQ mobile payment",
  },
] as const

/**
 * Shared delivery type options with display labels and descriptions
 */
export const SHARED_DELIVERY_TYPE_OPTIONS = [
  {
    value: DeliveryType.DELIVERY,
    label: "Home Delivery",
    shortLabel: "Delivery",
    icon: "🚚",
    color: "bg-gray-600 text-gray-100 ",
    description: "Deliver to customer address",
  },
  {
    value: DeliveryType.PICKUP,
    label: "Store Pickup",
    shortLabel: "Pickup",
    color: "bg-blue-600 text-gray-100 ",
    icon: "🏪",
    description: "Customer picks up from store",
  },
] as const

/**
 * Order status flow - defines valid status transitions
 * Used for status validation in edit forms
 */
export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
  [OrderStatus.CANCELLED]: [], // Terminal state
  [OrderStatus.REFUNDED]: [], // Terminal state
}

/**
 * Shared utility functions for order management
 * Can be used by both admin and customer interfaces
 */
export const SHARED_ORDER_UTILS = {
  /**
   * Get status option by value
   */
  getStatusOption: (status: OrderStatus) =>
    SHARED_ORDER_STATUS_OPTIONS.find((option) => option.value === status),

  /**
   * Get payment method option by value
   */
  getPaymentMethodOption: (method: PaymentMethod) =>
    SHARED_PAYMENT_METHOD_OPTIONS.find((option) => option.value === method),

  /**
   * Get delivery type option by value
   */
  getDeliveryTypeOption: (type: DeliveryType) =>
    SHARED_DELIVERY_TYPE_OPTIONS.find((option) => option.value === type),

  /**
   * Check if status transition is valid
   */
  isValidStatusTransition: (fromStatus: OrderStatus, toStatus: OrderStatus) =>
    ORDER_STATUS_FLOW[fromStatus].includes(toStatus),

  /**
   * Get available next statuses for current status
   */
  getAvailableNextStatuses: (currentStatus: OrderStatus) =>
    ORDER_STATUS_FLOW[currentStatus]
      .map((status) =>
        SHARED_ORDER_STATUS_OPTIONS.find((option) => option.value === status),
      )
      .filter(Boolean),

  /**
   * Check if payment can be manually updated (non-VISA)
   */
  canUpdatePaymentManually: (paymentMethod: PaymentMethod) =>
    paymentMethod !== PaymentMethod.VISA,

  /**
   * Format price for display
   */
  formatPrice: (price: number | string | unknown) => {
    let numPrice: number

    if (typeof price === "string") {
      numPrice = parseFloat(price)
    } else if (typeof price === "number") {
      numPrice = price
    } else {
      // Handle any other type (including Prisma Decimal) by converting to number
      numPrice = Number(price) || 0
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "JOD",
      minimumFractionDigits: 2,
    }).format(numPrice)
  },

  /**
   * Get customer display name (user or guest)
   */
  getCustomerDisplayName: (order: {
    user?: { name: string } | null
    guestName?: string | null
  }) => {
    return order.user?.name || order.guestName || "Guest Customer"
  },

  /**
   * Get customer email (user or guest)
   */
  getCustomerEmail: (order: {
    user?: { email: string } | null
    guestEmail?: string | null
  }) => {
    return order.user?.email || order.guestEmail || "No email provided"
  },

  /**
   * Get status label from status value
   */
  getStatusLabel: (status: OrderStatus) => {
    const option = SHARED_ORDER_STATUS_OPTIONS.find(
      (opt) => opt.value === status,
    )
    return option?.label || status
  },

  /**
   * Get status badge variant from status
   */
  getStatusBadgeVariant: (status: OrderStatus) => {
    const option = SHARED_ORDER_STATUS_OPTIONS.find(
      (opt) => opt.value === status,
    )
    return option?.color || "bg-gray-100 text-gray-800"
  },

  /**
   * Get delivery type label from delivery type value
   */
  getDeliveryTypeLabel: (deliveryType: DeliveryType) => {
    const option = SHARED_DELIVERY_TYPE_OPTIONS.find(
      (opt) => opt.value === deliveryType,
    )
    return option?.label || deliveryType
  },

  /**
   * Get delivery type icon from delivery type value
   */
  getDeliveryTypeIcon: (deliveryType: DeliveryType) => {
    const option = SHARED_DELIVERY_TYPE_OPTIONS.find(
      (opt) => opt.value === deliveryType,
    )
    return option?.icon || null
  },

  /**
   * Get payment method label from payment method value
   */
  getPaymentMethodLabel: (paymentMethod: PaymentMethod) => {
    const option = SHARED_PAYMENT_METHOD_OPTIONS.find(
      (opt) => opt.value === paymentMethod,
    )
    return option?.label || paymentMethod
  },

  /**
   * Format date for display
   */
  formatDate: (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj)
  },
} as const

/**
 * Customer-specific utilities that extend shared utilities
 */
export const CUSTOMER_ORDER_UTILS = {
  ...SHARED_ORDER_UTILS,

  /**
   * Get customer-friendly status description
   */
  getCustomerStatusDescription: (status: OrderStatus) => {
    const option = SHARED_ORDER_STATUS_OPTIONS.find(
      (opt) => opt.value === status,
    )
    if (!option) return status
    return option.customerDescription
  },

  /**
   * Get delivery type label for customer display
   */
  getCustomerDeliveryTypeLabel: (deliveryType: string) => {
    switch (deliveryType) {
      case "DELIVERY":
        return "Home Delivery"
      case "PICKUP":
        return "Store Pickup"
      default:
        return deliveryType
    }
  },
} as const

/**
 * Admin-specific utilities that extend shared utilities
 */
export const ADMIN_ORDER_UTILS = {
  ...SHARED_ORDER_UTILS,

  /**
   * Get admin-specific status description
   */
  getAdminStatusDescription: (status: OrderStatus) => {
    const option = SHARED_ORDER_STATUS_OPTIONS.find(
      (opt) => opt.value === status,
    )
    if (!option) return status
    return option.description
  },
} as const
