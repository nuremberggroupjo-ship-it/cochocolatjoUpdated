"use client"

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { PasswordInput } from "@/features/auth/components/password-input"
import { LoadingButton } from "@/components/shared/loading-button"

import { useResetPassword } from "../hooks/use-reset-password"

interface ResetPasswordFormProps {
  token?: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { form, submit, done, error, isLoading } = useResetPassword(token)

  if (done) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Password Updated</h2>
        <p className="text-sm text-muted-foreground">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="space-y-6"
        noValidate
      >
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <input type="hidden" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="New password" autoComplete="new-password" />
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
                <PasswordInput {...field} placeholder="Confirm password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Reset Password
        </LoadingButton>
      </form>
    </Form>
  )
}