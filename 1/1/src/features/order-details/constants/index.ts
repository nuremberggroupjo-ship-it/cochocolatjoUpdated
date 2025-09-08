import { DeliveryType, OrderStatus } from "@/lib/_generated/prisma"

import { FOOTER_ADDRESS } from "@/constants"

/**
 * Store CLIQ payment information
 */
export const STORE_CLIQ_INFO = {
  alisa: "COCHOCOLATJO",
  accountName: "CO Chocolat  Company",
  bankName: "Arab Bank",
  phoneNumber: FOOTER_ADDRESS.phoneNumber,
  instructions:
    "Transfer the total amount using CLIQ and we'll confirm your payment.",
} as const

/**
 * Store location and contact information for pickup orders
 */
export const STORE_PICKUP_INFO = {
  location_label: FOOTER_ADDRESS.location_label,
  location_link: FOOTER_ADDRESS.location_link,
  phoneNumber: FOOTER_ADDRESS.phoneNumber,
  email: FOOTER_ADDRESS.email,
  openingHours: FOOTER_ADDRESS.openingHours,
  // Google Maps URL constructed same way as footer

  instructions: "Please arrive during our opening hours to collect your order.",
} as const

/**
 * Smart status tracking for pickup orders
 * User-friendly labels and descriptions
 */
export const PICKUP_STATUS_TRACKING = [
  {
    status: OrderStatus.PENDING,
    label: "Order Confirmed",
    description: "Your order has been received and confirmed",
    icon: "✅",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    status: OrderStatus.PROCESSING,
    label: "Preparing Order",
    description: "We're carefully preparing your delicious chocolates",
    icon: "👨‍🍳",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    status: OrderStatus.SHIPPED,
    label: "Ready for Pickup",
    description: "Your order is ready for collection at our store",
    icon: "📦",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    status: OrderStatus.DELIVERED,
    label: "Completed",
    description: "Order completed successfully. Thank you!",
    icon: "🎉",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
] as const

/**
 * Smart status tracking for delivery orders
 * User-friendly labels and descriptions
 */
export const DELIVERY_STATUS_TRACKING = [
  {
    status: OrderStatus.PENDING,
    label: "Order Confirmed",
    description: "Your order has been received and confirmed",
    icon: "✅",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    status: OrderStatus.PROCESSING,
    label: "Preparing Order",
    description: "We're carefully preparing your delicious chocolates",
    icon: "👨‍🍳",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    status: OrderStatus.SHIPPED,
    label: "Shipped",
    description: "Your order is on the way to your address",
    icon: "🚚",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    status: OrderStatus.DELIVERED,
    label: "Delivered",
    description: "Order delivered successfully. Enjoy your chocolates!",
    icon: "🎉",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
] as const

/**
 * Order details page configuration
 */
export const ORDER_DETAILS_CONFIG = {
  heading: {
    title: "Order Details",
    description: "View your order information and status",
  },
  skeleton: {
    cardCount: 6,
    cardHeights: ["8rem", "12rem", "16rem", "10rem", "14rem", "8rem"] as const,
  },
  // Responsive breakpoints following your pattern
  breakpoints: {
    sm: 375,
    md: 768,
    lg: 1200,
    xl: 1440,
  },
} as const

/**
 * Helper function to get status tracking based on delivery type
 */
export const getStatusTrackingByDeliveryType = (deliveryType: DeliveryType) => {
  return deliveryType === DeliveryType.PICKUP
    ? PICKUP_STATUS_TRACKING
    : DELIVERY_STATUS_TRACKING
}

/**
 * Helper function to get current status info
 */
export const getCurrentStatusInfo = (
  status: OrderStatus,
  deliveryType: DeliveryType,
) => {
  const trackingSteps = getStatusTrackingByDeliveryType(deliveryType)
  return trackingSteps.find((step) => step.status === status)
}

/**
 * Helper function to get all completed statuses
 */
export const getCompletedStatuses = (
  currentStatus: OrderStatus,
  deliveryType: DeliveryType,
) => {
  const trackingSteps = getStatusTrackingByDeliveryType(deliveryType)
  const currentIndex = trackingSteps.findIndex(
    (step) => step.status === currentStatus,
  )
  return trackingSteps.slice(0, currentIndex + 1)
}
