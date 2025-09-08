import { FC } from "react"

import { CreditCardIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { PaymentMethodContentForm } from "@/features/checkout/components/payment-method/payment-method-content-form"
import { type AvailablePaymentMethodType } from "@/features/checkout/schemas/payment-method.schema"

interface PaymentMethodContentProps {
  defaultPaymentMethod?: AvailablePaymentMethodType
}

export const PaymentMethodContent: FC<PaymentMethodContentProps> = ({
  defaultPaymentMethod = "CASH_ON_DELIVERY",
}) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="size-5" />
          Payment Method
        </CardTitle>
        <CardDescription>
          Select your preferred payment method for the order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentMethodContentForm defaultPaymentMethod={defaultPaymentMethod} />
      </CardContent>
    </Card>
  )
}
