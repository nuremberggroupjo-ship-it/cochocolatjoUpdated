"use client"

import { format } from "date-fns"

import type { UserAdminData } from "@/types/db"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { PAYMENT_METHODS } from "@/features/checkout/constants"

interface UserInfoDisplayProps {
  user: UserAdminData
}

export function UserInfoDisplay({ user }: UserInfoDisplayProps) {
  // Get initials for avatar fallback
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email.charAt(0).toUpperCase()
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg tracking-wide">
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Avatar and Basic Info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || user.email}
            />
            <AvatarFallback className="text-lg">
              {getInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold">
              {user.name || "No name provided"}
            </h3>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  user.role === "ADMIN" ? "gradientDestructive" : "outline"
                }
              >
                {user.role}
              </Badge>
              {/* <Badge
                variant={user.emailVerified ? "default" : "destructive"}
                className={
                  user.emailVerified
                    ? "bg-success hover:bg-success/80 text-primary-foreground"
                    : "bg-destructive hover:bg-destructive/80 text-primary-foreground"
                }
              >
                {user.emailVerified ? "Verified" : "Unverified"}
              </Badge> */}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-muted-foreground text-sm font-semibold">
            Contact Information
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Email</p>
              <a
                href={`mailto:${user.email}`}
                className="text-primary hover:text-primary/80 text-sm underline underline-offset-4 transition-colors"
              >
                {user.email}
              </a>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Phone</p>
              {user.phone ? (
                <a
                  href={`tel:${user.phone}`}
                  className="text-primary hover:text-primary/80 text-sm underline underline-offset-4 transition-colors"
                >
                  {user.phone}
                </a>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No phone provided
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h4 className="text-muted-foreground text-sm font-semibold">
            Payment Method
          </h4>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm capitalize">
              {
                PAYMENT_METHODS.find(
                  (method) => method.value === user.paymentMethod,
                )?.label
              }
            </p>
          </div>
        </div>

        {/* Account Metadata */}
        <div className="space-y-4">
          <h4 className="text-muted-foreground text-sm font-semibold">
            Account Details
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Member Since
              </p>
              <p className="text-sm" title={format(user.createdAt, "PPP p")}>
                {format(user.createdAt, "MMM dd, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Last Updated
              </p>
              <p className="text-sm" title={format(user.updatedAt, "PPP p")}>
                {format(user.updatedAt, "MMM dd, yyyy")}
              </p>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">User ID</p>
            <p className="text-muted-foreground font-mono text-sm">{user.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
