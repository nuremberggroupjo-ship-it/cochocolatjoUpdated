"use client"

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingButton } from "@/components/shared/loading-button"

import { useForgotPassword } from "../hooks/use-forgot-password"

export function ForgotPasswordForm() {
  const { form, submit, success, error, isLoading } = useForgotPassword()

  if (success) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          If an account exists with that email, a password reset link has been sent.
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
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
          Send Reset Link
        </LoadingButton>
      </form>
    </Form>
  )
}