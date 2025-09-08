import { MapPin, Package } from "lucide-react"
import { CreditCardIcon, HandCoinsIcon, QrCodeIcon } from "lucide-react"

import type { PaymentMethodType } from "@/features/checkout/schemas/payment-method.schema"

export const DELIVERY_OPTIONS = [
  {
    value: "PICKUP" as const,
    label: "Pickup",
    description: "Pickup your order from our store",
    icon: Package,
    benefits: [
      //   "Free - No delivery charges",
      //   "Available for guests",
      "Ready in 30 minutes",
      "No minimum order",
    ],
  },
  {
    value: "DELIVERY" as const,
    label: "Delivery",
    description: "Get your order delivered to your address",
    icon: MapPin,
    benefits: [
      //   "Free delivery on orders over 30 JOD",
      //   "3 JOD delivery fee under 30 JOD",
      "Requires account login",
      "Delivered within 2-3 hours",
    ],
  },
] as const

export const PAYMENT_METHODS: Array<{
  value: PaymentMethodType
  label: string
  description: string
  icon: typeof CreditCardIcon
  disabled?: boolean
  comingSoon?: boolean
}> = [
  {
    value: "CASH_ON_DELIVERY",
    label: "Cash on Delivery",
    description: "Pay with cash when your order arrives",
    icon: HandCoinsIcon,
  },
  {
    value: "CLIQ",
    label: "CliQ",
    description: "Pay instantly using Jordan's CliQ payment",
    icon: QrCodeIcon,
  },
  {
    value: "VISA",
    label: "Visa Card",
    description: "Pay securely with your Visa card",
    icon: CreditCardIcon,
    disabled: true,
    comingSoon: true,
  },
] as const

export const JORDAN_CITIES = [
  "Amman",
  "Zarqa",
  "Irbid",
  "Russeifa",
  "Wadi as-Sir",
  "Aqaba",
  "Salt",
  "Madaba",
  "Jerash",
  "Ma'an",
  "Karak",
  "Mafraq",
] as const
