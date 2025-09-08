import { UserIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { type PickupInfoSchema } from "@/features/checkout/schemas/pickup-info.schema"

import { PickupInfoContentForm } from "./pickup-info-content-form"

interface PickupInfoContentProps {
  defaultValues: PickupInfoSchema
  isAuthenticated: boolean
}

export function PickupInfoContent({
  defaultValues,
  isAuthenticated,
}: PickupInfoContentProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="size-5" />
          Pickup Information
        </CardTitle>
        <CardDescription>
          {isAuthenticated
            ? "Your information has been pre-filled from your profile. You can modify it if needed."
            : "Please provide your information for order pickup."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <PickupInfoContentForm defaultValues={defaultValues} />
      </CardContent>
    </Card>
  )
}
