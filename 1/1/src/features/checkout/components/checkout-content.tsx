"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { DELIVERY_OPTIONS } from "@/features/checkout/constants"
import type { CheckoutDeliveryType } from "@/features/checkout/types/checkout-types"

export function CheckoutContent() {
  const router = useRouter()

  const [tempSelection, setTempSelection] =
    useState<CheckoutDeliveryType>("DELIVERY")

  const handleSelection = (value: CheckoutDeliveryType) => {
    setTempSelection(value)
  }

  const handleDeliveryTypeSelect = async (
    deliveryType: CheckoutDeliveryType,
  ) => {
    if (deliveryType === "PICKUP") {
      router.push("/checkout/pickup")
    } else {
      router.push("/checkout/delivery")
    }
  }

  return (
    <div className="space-y-6">
      <RadioGroup
        value={tempSelection}
        onValueChange={handleSelection}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        {DELIVERY_OPTIONS.map((option) => {
          const Icon = option.icon
          const isSelected = tempSelection === option.value

          return (
            <div key={option.value} className="relative">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="sr-only"
              />
              <Label htmlFor={option.value} className="block cursor-pointer">
                <Card
                  className={cn(
                    "h-full shadow-none transition-all duration-200 hover:shadow",
                    isSelected
                      ? "ring-primary border-primary bg-primary/5 ring-2"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "rounded-lg p-3 transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Icon className="size-6" />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {option.label}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {option.description}
                          </p>
                        </div>

                        <ul className="space-y-2">
                          {option.benefits.map((benefit, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <div className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            </div>
          )
        })}
      </RadioGroup>

      {/* Action Buttons */}
      <div className="flex flex-col justify-start gap-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={() => router.push("/cart")}
          size="lg"
          className="flex cursor-pointer items-center gap-2"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Cart
        </Button>
        <Button
          onClick={() => handleDeliveryTypeSelect(tempSelection!)}
          disabled={!tempSelection}
          size="lg"
          className="flex cursor-pointer items-center gap-2"
        >
          Continue
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
