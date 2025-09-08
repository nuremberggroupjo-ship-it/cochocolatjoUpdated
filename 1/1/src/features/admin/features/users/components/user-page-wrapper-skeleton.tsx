import { FC } from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const UserPageWrapperSkeleton: FC = () => {
  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>

      <Separator className="bg-border/50" />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Information - Left Column (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          {/* User Info Card */}
          <Card className="shadow-none">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Avatar & Basic Info */}
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>

              {/* User Statistics */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Addresses Card */}
          <Card className="shadow-none">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address List */}
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="space-y-3 border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Orders/Activity Card */}
          <Card className="shadow-none">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recent Orders */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0"
                >
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Edit Form - Right Column (1/3 width) */}
        <div className="lg:col-span-1">
          <Card className="shadow-none">
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Role Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-0" />
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <div className="flex items-start space-x-3 rounded-md border p-4">
                  <Skeleton className="mt-0.5 h-4 w-4 rounded-sm" />
                  <div className="space-y-1 leading-none">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-full max-w-md" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
