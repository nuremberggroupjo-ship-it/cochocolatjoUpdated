"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { FormErrorAlert } from "@/components/shared/form-error-alert"
import { LoadingButton } from "@/components/shared/loading-button"
import { RequiredFormLabel } from "@/components/shared/required-form-label"

import { PasswordInput } from "@/features/auth/components/password-input"
import { useRegister } from "@/features/auth/features/register/hooks/use-register"
import { type RegisterFormType } from "@/features/auth/features/register/schemas/register.schema"

export const RegisterForm = () => {
  const { register, isLoading, error, form } = useRegister()

  async function onSubmit(values: RegisterFormType) {
    await register(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel label="Name" />
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="Full name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel label="Email" />
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel label="Password" />
              <FormControl>
                <PasswordInput disabled={isLoading} {...field} />
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
              <RequiredFormLabel label="Confirm Password" />
              <FormControl>
                <PasswordInput
                  disabled={isLoading}
                  {...field}
                  placeholder="Confirm Password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <FormErrorAlert error={error} />}
        <div className="flex justify-center">
          <LoadingButton isLoading={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
