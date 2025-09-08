"use client"

import type { UserAdminData } from "@/types/db"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { AddressSchema } from "@/features/checkout/schemas/address.schema"

interface UserAddressDisplayProps {
  user: UserAdminData
}

export function UserAddressDisplay({ user }: UserAddressDisplayProps) {
  // Parse addresses from JSON format
  const addresses = Array.isArray(user.addresses)
    ? (user.addresses as AddressSchema[])
    : []

  if (addresses.length === 0) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No addresses on file for this user.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg tracking-wide">
          Addresses ({addresses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {addresses.map((address: AddressSchema, index: number) => (
            <div
              key={index}
              className="bg-card text-card-foreground rounded-lg border p-4"
            >
              {/* Address Details */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  {address.name && (
                    <div>
                      <p className="text-muted-foreground text-sm">Name</p>
                      <p className="text-sm">{address.name}</p>
                    </div>
                  )}

                  {/* Default Address Indicator */}
                  {address.isDefault && (
                    <div>
                      <Badge className="text-xs">Default Address</Badge>
                    </div>
                  )}
                </div>

                {/* City, Area */}
                <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  {address.city && (
                    <div>
                      <p className="text-muted-foreground text-sm">City</p>
                      <p className="text-sm">{address.city}</p>
                    </div>
                  )}
                  {address.area && (
                    <div>
                      <p className="text-muted-foreground text-sm">Area</p>
                      <p className="text-sm">{address.area}</p>
                    </div>
                  )}
                </div>

                {/* Street Address */}
                {address.street && (
                  <div>
                    <p className="text-muted-foreground text-sm">Street</p>
                    <p className="text-sm">{address.street}</p>
                  </div>
                )}

                {/* Building Information */}
                <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  {address.buildingNumber && (
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Building Number
                      </p>
                      <p className="text-sm">{address.buildingNumber}</p>
                    </div>
                  )}
                  {address.apartmentNumber && (
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Apartment Number
                      </p>
                      <p className="text-sm">{address.apartmentNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
