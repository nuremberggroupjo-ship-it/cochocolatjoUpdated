"use client"

import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import type { UserAdminData } from "@/types/db"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { saveUserAction } from "@/features/admin/features/users/actions/save-user.action"
import { saveUserSchema } from "@/features/admin/features/users/lib/user.schema"

type SaveUserFormData = z.infer<typeof saveUserSchema>

interface UserEditFormProps {
  user: UserAdminData
}

/**
 * User edit form component for admin dashboard
 * Only allows editing of user role as per requirements
 * Provides clear visual feedback and validation
 */
export function UserEditForm({ user }: UserEditFormProps) {
  const router = useRouter()

  // Initialize form with current user data
  const form = useForm<SaveUserFormData>({
    resolver: zodResolver(saveUserSchema),
    defaultValues: {
      id: user.id,
      role: user.role,
    },
  })

  // Setup server action - bind with user ID for the action that requires existingId
  const boundSaveUserAction = saveUserAction.bind(null, user.id)

  const { execute, isPending } = useAction(boundSaveUserAction, {
    onSuccess: (args) => {
      toast.success(args.data?.message)

      // Check if role was downgraded (roleChanged flag from server response)
      const roleChanged = args.data?.result?.roleChanged

      if (roleChanged) {
        // Force page refresh to clear client-side session cache when role changes
        // This ensures the UI immediately reflects the role change
        toast.success("Role changed! Refreshing page to update UI...", {
          duration: 2000,
        })
        setTimeout(() => {
          window.location.href = ADMIN_TABLE.users.routes.default
        }, 1500)
      } else {
        // Normal navigation for other changes
        router.push(ADMIN_TABLE.users.routes.default)
        router.refresh()
      }
    },
    onError: (args) => {
      toast.error(args.error.serverError)
    },
  })

  // Handle form submission
  const onSubmit = (data: SaveUserFormData) => {
    execute(data)
  }

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-none">
      <CardHeader>
        <CardTitle className="text-lg tracking-wide">Edit User Role</CardTitle>
        <CardDescription>
          Update the role for {user.name || user.email}. This will affect their
          permissions within the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">
                        <div className="flex items-center gap-2">
                          <div className="bg-secondary h-2 w-2 rounded-full" />
                          <span>User</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ADMIN">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary h-2 w-2 rounded-full" />
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Admin users have full access to the dashboard and all
                    management features. Regular users have limited access to
                    customer-facing features only.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(ADMIN_TABLE.users.routes.default)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                isLoading={isPending}
                disabled={!form.formState.isDirty}
              >
                Update Role
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
