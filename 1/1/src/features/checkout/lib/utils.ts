/**
 * Generate unique order number
 */
export const generateOrderNumber = (): string => {
  const now = new Date()
  const dateString = now.toISOString().slice(0, 10).replace(/-/g, "") // YYYYMMDD
  const timeString = now.toISOString().slice(11, 19).replace(/:/g, "") // HHMMSS
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()

  return `order_${dateString}_${timeString}_${randomString}`
}
