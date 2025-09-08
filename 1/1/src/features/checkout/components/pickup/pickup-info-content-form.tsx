"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon } from "lucide-react"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { LoadingButton } from "@/components/shared/loading-button"
import { RequiredFormLabel } from "@/components/shared/required-form-label"

import { savePickupInfo } from "@/features/checkout/actions/pick-up.actions"
import {
  type PickupInfoSchema,
  pickupInfoSchema,
} from "@/features/checkout/schemas/pickup-info.schema"

interface PickupInfoContentFormProps {
  defaultValues: PickupInfoSchema
}

export function PickupInfoContentForm({
  defaultValues,
}: PickupInfoContentFormProps) {
  const router = useRouter()

  const form = useForm<PickupInfoSchema>({
    resolver: zodResolver(pickupInfoSchema),
    defaultValues,
  })

  const { execute, isPending } = useAction(savePickupInfo, {
    onSuccess(args) {
      router.push("/checkout/pickup/place-order")
      toast.success(args.data?.message)
    },
    onError(args) {
      toast.error(args.error.serverError)
    },
  })

  const onSubmit = (values: PickupInfoSchema) => {
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
    console.log("showNote: ", showNote)
    const [isGift, setIsGift] = useState(false)
    console.log("isGift:", isGift)
    console.log("date: ", date)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>
                  <RequiredFormLabel label="Full Name" />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserIcon className="text-primary absolute top-2.5 left-3 size-4" />
                    <Input
                      {...field}
                      placeholder="Full name"
                      className="pl-10"
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
              <FormItem className="w-full flex-1">
                <FormLabel>
                  <RequiredFormLabel label="Phone Number" />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <PhoneIcon className="text-primary absolute top-2.5 left-3 size-4" />
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Phone number"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <MailIcon className="text-primary absolute top-2.5 left-3 size-4" />
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email"
                    className="pl-10"
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
              <FormLabel>Additional Notes
                {showNote && <span className="ml-1 text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Any special instructions or notes for pickup"
                  className="max-h-56 min-h-24 resize-none overflow-y-auto"
                  required={showNote}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
