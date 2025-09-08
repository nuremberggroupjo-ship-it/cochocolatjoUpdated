import Link from "next/link"

import { ExternalLinkIcon, UserIcon } from "lucide-react"

import type { OrderAdminData } from "@/types/db"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"

import { ADMIN_TABLE } from "@/features/admin/constants"

export const CustomerInfoCard = (
  props: Pick<
    OrderAdminData,
    "user" | "guestName" | "guestEmail" | "guestPhone"
  >,
) => {
  const { user, guestName, guestEmail, guestPhone } = props

  const isRegisteredUser = !!user
  const customerName = isRegisteredUser ? user.name : guestName
  const customerEmail = isRegisteredUser ? user.email : guestEmail
  const customerPhone = isRegisteredUser ? user.phone : guestPhone

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="size-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Name</p>
            <div className="flex items-center gap-1">
              <p className="font-medium">{customerName}</p>
              {isRegisteredUser && (
                <ButtonWithTooltip
                  className="size-6"
                  tooltipContent={`View "${customerName}" profile`}
                >
                  <Link href={`${ADMIN_TABLE.users.routes.default}/${user.id}`}>
                    <span className="sr-only">View {customerName} details</span>
                    <ExternalLinkIcon className="h-3 w-3" />
                  </Link>
                </ButtonWithTooltip>
              )}
            </div>
          </div>
          {customerEmail && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">Email</p>
              <Link className="font-medium" href={`mailto:${customerEmail}`}>
                {customerEmail}
              </Link>
            </div>
          )}
          {customerPhone && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">Phone</p>
              <Link className="font-medium" href={`tel:${customerPhone}`}>
                {customerPhone}
              </Link>
            </div>
          )}
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Customer Type
            </p>
            <Badge variant={isRegisteredUser ? "default" : "secondary"}>
              {isRegisteredUser ? "Registered" : "Guest"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
