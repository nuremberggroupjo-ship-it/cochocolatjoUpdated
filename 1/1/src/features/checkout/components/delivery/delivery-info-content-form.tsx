"use client"

import { useRouter } from "next/navigation"
import { FC } from "react"
import { useState } from "react"

import { ChevronDownIcon } from "lucide-react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { LoadingButton } from "@/components/shared/loading-button"
import { RequiredFormLabel } from "@/components/shared/required-form-label"

import { saveDeliveryInfo } from "@/features/checkout/actions/delivery.actions"
import { type DeliveryInfoFormData } from "@/features/checkout/schemas/delivery.schema"

interface DeliveryInfoContentFormProps {
  form: UseFormReturn<DeliveryInfoFormData>
}

export const DeliveryInfoContentForm: FC<DeliveryInfoContentFormProps> = ({
  form,
}) => {
  const router = useRouter()

  const { execute, isPending } = useAction(saveDeliveryInfo, {
    onSuccess(args) {
      toast.success(args.data?.message)
      router.push("/checkout/delivery/payment-method")
    },
    onError(args) {
      toast.error(args.error.serverError)
    },
  })

  const onSubmit = async (values: DeliveryInfoFormData) => {
    const dataToSend = {
      ...values,
      isGift,
      date: date ? date.toISOString() : undefined,
    }

    execute(dataToSend)
  }

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [showNote, setShowNote] = useState(false)
  const [isGift, setIsGift] = useState(false)


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredFormLabel label="Name" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <UserIcon className="text-muted-foreground absolute top-3 left-3 size-4" />
                  <Input
                    placeholder="Enter your full name"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel label="Email" />
              <FormControl>
                <div className="relative">
                  <MailIcon className="text-muted-foreground absolute top-3 left-3 size-4" />
                  <Input
                    type="email"
                    placeholder="Enter your email for order updates"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredFormLabel label="Phone Number" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <PhoneIcon className="text-muted-foreground absolute top-3 left-3 size-4" />
                  <Input
                    type="tel"
                    placeholder="07xxxxxxxx"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional Notes Field */}
        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Additional Notes
                {showNote && <span className="ml-1 text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special instructions for delivery (e.g., gate code, building instructions)"
                  className="max-h-56 min-h-24 resize-none overflow-y-auto"
                  {...field}
                  required={showNote}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* date filed */}
        <div className="p-4">
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date-picker" className="px-1">
                  Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="w-32 justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date)
                        setOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
                  
            </div>
            {/* Gift checkbox */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showNote}
                onChange={(e) => {
                  setShowNote(e.target.checked)
                  setIsGift(e.target.checked)
                }}
              />
              Mark as Gift 🎁
            </label>
          </div>
        </div>

        <Separator className="bg-border/50" />

        <div className="flex flex-col justify-start gap-2 sm:flex-row">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/checkout")}
            size="lg"
            className="flex cursor-pointer items-center gap-2"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Checkout
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
