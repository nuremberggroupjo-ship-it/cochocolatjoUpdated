"use client"

import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { OrderAdminData } from "@/types/db"

import { OrderStatus } from "@/lib/_generated/prisma"
import { cn, formatDate } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { LoadingButton } from "@/components/shared/loading-button"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { ORDER_STATUS_OPTIONS } from "@/features/admin/features/orders/constants"
import { useOrderFormSync } from "@/features/admin/features/orders/hooks/use-order-form-sync"
import { useOrderSave } from "@/features/admin/features/orders/hooks/use-order-save"
import {
  type SaveOrderSchema,
  saveOrderSchema,
} from "@/features/admin/features/orders/lib/order.schema"

import { OrderConfirmationModel } from "./components"

interface OrderEditFormProps {
  order: OrderAdminData
}

export function OrderEditForm({ order }: OrderEditFormProps) {
  const router = useRouter()

  // Initialize form with current order data
  const form = useForm<SaveOrderSchema>({
    resolver: zodResolver(saveOrderSchema),
    defaultValues: {
      id: order.id,
      status: order.status,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
    },
  })

  // Watch form values for real-time validation and auto-sync
  const [status, isPaid, isDelivered] = form.watch([
    "status",
    "isPaid",
    "isDelivered",
  ])

  // Custom hooks for cleaner code organization
  const orderSave = useOrderSave({ order })
  const { realTimeWarnings, handleDeliveryChange, handlePaymentChange } =
    useOrderFormSync({
      form,
      order,
      status,
      isPaid,
      isDelivered,
    })

  return (
    <>
      {/* Card Form */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Edit Order Status</CardTitle>
          <CardDescription>
            Update the order status, payment status, and delivery/pickup status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/*  Warnings */}
          {realTimeWarnings.length > 0 && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2">
                <span className="text-amber-600">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Business Logic Warning
                  </p>
                  <ul className="mt-1 list-inside list-disc text-xs text-amber-700">
                    {realTimeWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(orderSave.handleSubmit)}
              className="space-y-6"
            >
              {/* Order Status Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select order status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ORDER_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "size-2 rounded-full",
                                  option.color,
                                )}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current status of the order in the fulfillment process.
                      {status === OrderStatus.DELIVERED && !isDelivered && (
                        <>
                          <br />
                          <span className="text-xs text-blue-600">
                            💡 Setting status to &ldquo;Delivered&rdquo; will
                            automatically mark the order as delivered.
                          </span>
                        </>
                      )}
                      {(isPaid || isDelivered) &&
                        status === OrderStatus.PENDING && (
                          <>
                            <br />
                            <span className="text-xs text-green-600">
                              💡 Status will auto-update based on payment and
                              delivery state.
                            </span>
                          </>
                        )}
                      {!isPaid &&
                        !isDelivered &&
                        status !== OrderStatus.PENDING && (
                          <>
                            <br />
                            <span className="text-xs text-orange-600">
                              💡 Both checkboxes unchecked - status will revert
                              to Pending.
                            </span>
                          </>
                        )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Status Field */}
              <FormField
                control={form.control}
                name="isPaid"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4",
                      order.isPaid &&
                        field.value === false &&
                        "border-amber-200 bg-amber-50",
                    )}
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={handlePaymentChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        className={cn(
                          order.isPaid &&
                            field.value === false &&
                            "text-amber-800",
                        )}
                      >
                        Payment Received
                      </FormLabel>
                      <FormDescription>
                        Mark this order as paid when payment is confirmed.
                        {order.isPaid && field.value === false && (
                          <>
                            <br />
                            <span className="text-xs font-medium text-amber-700">
                              ⚠️ Warning: Unchecking will remove payment
                              timestamp and mark order as unpaid.
                            </span>
                          </>
                        )}
                        {!isPaid && status === OrderStatus.PENDING && (
                          <>
                            <br />
                            <span className="text-xs text-blue-600">
                              💡 Checking this will auto-advance status to
                              Processing.
                            </span>
                          </>
                        )}
                        {isPaid &&
                          !isDelivered &&
                          status !== OrderStatus.PENDING && (
                            <>
                              <br />
                              <span className="text-xs text-orange-600">
                                💡 Unchecking this (with delivery also
                                unchecked) will revert status to Pending.
                              </span>
                            </>
                          )}
                        {order.paidAt && (
                          <>
                            <br />
                            <span className="text-muted-foreground text-xs">
                              Originally paid:&nbsp;
                              {formatDate(order.paidAt as Date)}
                            </span>
                          </>
                        )}
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Delivery Status Field */}
              <FormField
                control={form.control}
                name="isDelivered"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4",
                      order.isDelivered &&
                        field.value === false &&
                        "border-red-200 bg-red-50",
                    )}
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={handleDeliveryChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        className={cn(
                          order.isDelivered &&
                            field.value === false &&
                            "text-red-800",
                        )}
                      >
                        Order&nbsp;
                        {order.deliveryType === "DELIVERY"
                          ? "Delivered"
                          : "Picked Up"}
                      </FormLabel>
                      <FormDescription>
                        Mark this order as&nbsp;
                        {order.deliveryType === "DELIVERY"
                          ? "delivered"
                          : "picked up"}
                        &nbsp;when completed.
                        {order.isDelivered && field.value === false && (
                          <>
                            <br />
                            <span className="text-xs font-medium text-red-700">
                              ⚠️ Warning: This order was previously marked
                              as&nbsp;
                              {order.deliveryType === "DELIVERY"
                                ? "delivered"
                                : "picked up"}
                              . Unchecking requires careful consideration.
                            </span>
                          </>
                        )}
                        {!isDelivered &&
                          isPaid &&
                          (status === OrderStatus.PENDING ||
                            status === OrderStatus.PROCESSING) && (
                            <>
                              <br />
                              <span className="text-xs text-blue-600">
                                💡 Checking this will auto-advance order status
                                to Delivered.
                              </span>
                            </>
                          )}
                        {status === OrderStatus.DELIVERED && (
                          <>
                            <br />
                            <span className="text-xs text-green-600">
                              ✅ This checkbox can be freely toggled even when
                              status is &ldquo;Delivered&rdquo;.
                            </span>
                          </>
                        )}
                        {isDelivered &&
                          !isPaid &&
                          status !== OrderStatus.PENDING && (
                            <>
                              <br />
                              <span className="text-xs text-orange-600">
                                💡 Unchecking this (with payment also unchecked)
                                will revert status to Pending.
                              </span>
                            </>
                          )}
                        {order.deliveredAt && (
                          <>
                            <br />
                            <span className="text-muted-foreground text-xs">
                              Originally delivered:&nbsp;
                              {formatDate(order.deliveredAt as Date)}
                            </span>
                          </>
                        )}
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(ADMIN_TABLE.orders.routes.default)}
                  disabled={orderSave.isPending}
                >
                  Cancel
                </Button>
                <LoadingButton type="submit" isLoading={orderSave.isPending}>
                  Update Order
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* order confirmation Responsive Modal */}
      <OrderConfirmationModel orderSave={orderSave} />
    </>
  )
}
