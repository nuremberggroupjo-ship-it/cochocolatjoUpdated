import { DeliveryType, OrderStatus } from "@/lib/_generated/prisma"

import {
  getCompletedStatuses,
  getCurrentStatusInfo,
  getStatusTrackingByDeliveryType,
} from "@/features/order-details/constants"

/**
 * Get user-friendly status label based on delivery type
 */
export const getStatusLabel = (
  status: OrderStatus,
  deliveryType: DeliveryType,
): string => {
  const statusInfo = getCurrentStatusInfo(status, deliveryType)
  return statusInfo?.label || status
}

/**
 * Get user-friendly status description based on delivery type
 */
export const getStatusDescription = (
  status: OrderStatus,
  deliveryType: DeliveryType,
): string => {
  const statusInfo = getCurrentStatusInfo(status, deliveryType)
  return statusInfo?.description || "Order status updated"
}

/**
 * Get status icon based on delivery type
 */
export const getStatusIcon = (
  status: OrderStatus,
  deliveryType: DeliveryType,
): string => {
  const statusInfo = getCurrentStatusInfo(status, deliveryType)
  return statusInfo?.icon || "📋"
}

/**
 * Get status color classes based on delivery type
 */
export const getStatusColor = (
  status: OrderStatus,
  deliveryType: DeliveryType,
): string => {
  const statusInfo = getCurrentStatusInfo(status, deliveryType)
  return (
    statusInfo?.color ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  )
}

/**
 * Check if a status step is completed
 */
export const isStatusCompleted = (
  stepStatus: OrderStatus,
  currentStatus: OrderStatus,
  deliveryType: DeliveryType,
): boolean => {
  const completedStatuses = getCompletedStatuses(currentStatus, deliveryType)
  return completedStatuses.some((step) => step.status === stepStatus)
}

/**
 * Check if a status step is current
 */
export const isStatusCurrent = (
  stepStatus: OrderStatus,
  currentStatus: OrderStatus,
): boolean => {
  return stepStatus === currentStatus
}

/**
 * Get progress percentage based on current status
 */
export const getProgressPercentage = (
  currentStatus: OrderStatus,
  deliveryType: DeliveryType,
): number => {
  const trackingSteps = getStatusTrackingByDeliveryType(deliveryType)
  const currentIndex = trackingSteps.findIndex(
    (step) => step.status === currentStatus,
  )

  if (currentIndex === -1) return 0

  // Calculate percentage based on step completion
  return Math.round(((currentIndex + 1) / trackingSteps.length) * 100)
}

/**
 * Get estimated time for next status (for future enhancement)
 */
export const getEstimatedTime = (
  currentStatus: OrderStatus,
  deliveryType: DeliveryType,
): string | null => {
  // This can be enhanced with real time estimates later
  if (currentStatus === OrderStatus.PENDING) {
    return "30 minutes"
  }
  if (currentStatus === OrderStatus.PROCESSING) {
    return deliveryType === DeliveryType.PICKUP ? "15 minutes" : "2-3 hours"
  }
  if (
    currentStatus === OrderStatus.SHIPPED &&
    deliveryType === DeliveryType.DELIVERY
  ) {
    return "1-2 hours"
  }
  return null
}

/**
 * Get next status in the workflow
 */
export const getNextStatus = (
  currentStatus: OrderStatus,
  deliveryType: DeliveryType,
): OrderStatus | null => {
  const trackingSteps = getStatusTrackingByDeliveryType(deliveryType)
  const currentIndex = trackingSteps.findIndex(
    (step) => step.status === currentStatus,
  )

  if (currentIndex === -1 || currentIndex === trackingSteps.length - 1) {
    return null
  }

  return trackingSteps[currentIndex + 1].status
}
