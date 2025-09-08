"use client"

import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

import { LoadingButton } from "@/components/shared/loading-button"

import { savePaymentMethod } from "@/features/checkout/actions/payment-method.actions"
import { PAYMENT_METHODS } from "@/features/checkout/constants"
import {
  type AvailablePaymentMethodType,
  type PaymentMethodFormData,
  paymentMethodSchema,
} from "@/features/checkout/schemas/payment-method.schema"

interface PaymentMethodContentFormProps {
  defaultPaymentMethod?: AvailablePaymentMethodType
}

export function PaymentMethodContentForm({
  defaultPaymentMethod,
}: PaymentMethodContentFormProps) {
  const router = useRouter()

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      paymentMethod: defaultPaymentMethod,
    },
  })

  const { execute, isPending } = useAction(savePaymentMethod, {
    onSuccess: (args) => {
      toast.success(args.data?.message)
      router.push("/checkout/delivery/payment-method/place-order")
    },
    onError: (args) => {
      toast.error(args.error.serverError)
    },
  })

  const onSubmit = async (values: PaymentMethodFormData) => {
    execute(values)
  }

  const selectedPaymentMethod = form.watch("paymentMethod")
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  {PAYMENT_METHODS.map((method) => {
                    const IconComponent = method.icon
                    const isSelected = selectedPaymentMethod === method.value
                    const isDisabled = method.disabled || false

                    return (
                      <div key={method.value} className="relative">
                        <RadioGroupItem
                          value={method.value}
                          id={method.value}
                          className="sr-only"
                          disabled={isDisabled}
                        />
                        <Label
                          htmlFor={method.value}
                          className={cn(
                            "block",
                            isDisabled
                              ? "cursor-not-allowed"
                              : "cursor-pointer",
                          )}
                        >
                          <Card
                            className={cn(
                              "relative h-full py-4 shadow-none transition-all duration-200 hover:shadow",
                              isSelected && !isDisabled
                                ? "ring-primary border-primary bg-primary/5 ring-2"
                                : "border-border hover:border-primary/50",
                              isDisabled &&
                                "hover:border-border cursor-not-allowed hover:shadow-none",
                            )}
                          >
                            <CardContent
                              className={cn("p-4", isDisabled && "opacity-60")}
                            >
                              <div className="flex items-start gap-4">
                                {/* Logo */}
                                <div
                                  className={cn(
                                    "rounded-lg p-3 transition-colors",
                                    isSelected && !isDisabled
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground",
                                    isDisabled &&
                                      "bg-muted/50 text-muted-foreground/50",
                                  )}
                                >
                                  <IconComponent className="size-6" />
                                </div>
                                {/* Info */}
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold">
                                    {method.label}
                                  </h3>
                                  <p className="text-muted-foreground text-xs">
                                    {method.comingSoon
                                      ? "This payment method will be available soon"
                                      : method.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>

                            {/* coming soon Badge */}
                            {method.comingSoon && (
                              <Badge
                                variant="gradientDestructive"
                                className="absolute top-2 right-2"
                              >
                                Soon
                              </Badge>
                            )}
                          </Card>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="bg-border/50" />

        <div className="flex flex-col justify-start gap-2 sm:flex-row">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/checkout/delivery")}
            size="lg"
            className="flex cursor-pointer items-center gap-2"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Delivery
          </Button>
          <LoadingButton
            type="submit"
            isLoading={isPending}
            size="lg"
            className="flex cursor-pointer items-center gap-2"
          >
            Continue
            <ArrowRightIcon className="size-4" />
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
