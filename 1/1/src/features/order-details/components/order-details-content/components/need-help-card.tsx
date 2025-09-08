"use client"

import {
  HelpCircleIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react"

import type { CustomerOrderDetailsData } from "@/types/db"

import { formatDate } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { STORE_PICKUP_INFO } from "@/features/order-details/constants"

export const NeedHelpCard = ({
  orderNumber,
  createdAt,
}: Pick<CustomerOrderDetailsData, "orderNumber" | "createdAt">) => {
  const handleCallSupport = () => {
    window.open(`tel:${STORE_PICKUP_INFO.phoneNumber}`, "_self")
  }

  const handleEmailSupport = () => {
    const subject = `Support Request - Order #${orderNumber}`
    const body = `Hello,\n\nI need assistance with my order:\nOrder Number: ${orderNumber}\nOrder Date: ${formatDate(createdAt)}\n\nDescription of issue:\n[Please describe your issue here]\n\nThank you!`

    window.open(
      `mailto:${STORE_PICKUP_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_self",
    )
  }

  const handleWhatsAppSupport = () => {
    const message = `Hello! I need help with my order #${orderNumber}. Order placed on ${formatDate(createdAt)}.`
    const phoneNumber = STORE_PICKUP_INFO.phoneNumber
      .replace(/\s+/g, "")
      .replace(/^\+/, "")

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    )
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircleIcon className="size-5" />
          Need Help?
        </CardTitle>
        <CardDescription>
          Our customer support team is here to help with any questions about
          your order.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Call Support */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCallSupport}
          >
            <PhoneIcon className="mr-2 size-4" />
            Call Support
            <span className="text-muted-foreground ml-auto text-sm">
              {STORE_PICKUP_INFO.phoneNumber}
            </span>
          </Button>

          {/* WhatsApp Support */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleWhatsAppSupport}
          >
            <MessageCircleIcon className="mr-2 size-4" />
            WhatsApp Support
            <span className="text-muted-foreground ml-auto text-sm">
              Quick response
            </span>
          </Button>

          {/* Email Support */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleEmailSupport}
          >
            <MailIcon className="mr-2 size-4" />
            Email Support
            <span className="text-muted-foreground ml-auto text-sm">
              {STORE_PICKUP_INFO.email}
            </span>
          </Button>
        </div>

        <Separator className="bg-border/50" />

        {/* Support Hours */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Support Hours</h4>
          <p className="text-muted-foreground text-sm">
            {STORE_PICKUP_INFO.openingHours}
          </p>
          <p className="text-muted-foreground text-xs">
            We typically respond to WhatsApp and email within 1-2 hours during
            business hours.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
