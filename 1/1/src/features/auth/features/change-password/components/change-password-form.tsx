"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingButton } from "@/components/shared/loading-button"
import { PasswordInput } from "@/features/auth/components/password-input"

import { useChangePassword } from "../hooks/use-change-password"

export function ChangePasswordForm() {
  const { form, submit, done, error, isLoading } = useChangePassword()
  const router = useRouter()

  // Redirect to home after successful password change
  useEffect(() => {
    if (done) {
      const t = setTimeout(() => {
        router.push("/")   // HOME REDIRECT
        router.refresh()   // optional: ensure fresh data
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [done, router])

  return (
    <div className="space-y-4">
      {done && (
        <Alert>
          <AlertDescription>
            Password updated successfully. Redirecting to home...
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="space-y-6"
          noValidate
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Current password"
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="New password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            Change Password
          </LoadingButton>
        </form>
      </Form>
    </div>
  )
}