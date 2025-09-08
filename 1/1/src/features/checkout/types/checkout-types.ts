/**
 * TypeScript types for the checkout feature
 * Contains all type definitions for checkout flow, addresses, and orders
 */
import {
  DeliveryType,
  OrderStatus,
  PaymentMethod,
} from "@/lib/_generated/prisma"

/**
 * Delivery type selection for checkout
 */
export type CheckoutDeliveryType = DeliveryType

/**
 * Payment method options for checkout
 */
export type CheckoutPaymentMethod = PaymentMethod

/**
 * Order status for tracking
 */
export type CheckoutOrderStatus = OrderStatus

/**
 * Address information for delivery orders
 */
export interface CheckoutAddress {
  id?: string
  name: string
  email: string
  phone: string
  area: string
  street: string
  city: string
  country: string
  buildingNumber: string
  apartmentNumber?: string
  additionalNotes?: string
  isDefault: boolean
}

/**
 * Pickup information for pickup orders
 */
export interface PickupInfo {
  name: string
  email?: string
  phone: string
  additionalNotes?: string
}

/**
 * Cart item for checkout display
 */
export interface CheckoutCartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    discountPrice: number | null
    isDiscountActive: boolean
    stock: number
    shortDescription: string
    productImages: Array<{
      imageUrl: string
    }>
  }
}

/**
 * Cart summary for checkout
 */
export interface CheckoutCartSummary {
  id: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  items: CheckoutCartItem[]
  totalItems: number
}

/**
 * Order summary for review pages
 */
export interface OrderSummary {
  cartSummary: CheckoutCartSummary
  deliveryType: CheckoutDeliveryType
  pickupInfo?: PickupInfo
  deliveryAddress?: CheckoutAddress
  paymentMethod?: CheckoutPaymentMethod
  finalTotal: number
  shippingCost: number
}

/**
 * Order creation data
 */
export interface CreateOrderData {
  deliveryType: CheckoutDeliveryType
  pickupInfo?: PickupInfo
  deliveryAddress?: CheckoutAddress
  paymentMethod?: CheckoutPaymentMethod
  cartItems: CheckoutCartItem[]
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
}

/**
 * Order details for success page
 */
export interface OrderDetails {
  id: string
  orderNumber: string
  status: CheckoutOrderStatus
  deliveryType: CheckoutDeliveryType
  createdAt: Date
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  pickupInfo?: PickupInfo
  deliveryAddress?: CheckoutAddress
  paymentMethod?: CheckoutPaymentMethod
  items: Array<{
    id: string
    quantity: number
    price: number
    name: string
    slug: string
    image: string
  }>
}

/**
 * Checkout step type for navigation
 */
export type CheckoutStep =
  | "delivery-type"
  | "pickup-info"
  | "pickup-place-order"
  | "delivery-address"
  | "delivery-payment"
  | "delivery-place-order"
  | "success"

/**
 * Checkout state for navigation and form management
 */
export interface CheckoutState {
  currentStep: CheckoutStep
  deliveryType?: CheckoutDeliveryType
  pickupInfo?: PickupInfo
  selectedAddress?: CheckoutAddress
  selectedPaymentMethod?: CheckoutPaymentMethod
  cartSummary?: CheckoutCartSummary
  orderId?: string
}
