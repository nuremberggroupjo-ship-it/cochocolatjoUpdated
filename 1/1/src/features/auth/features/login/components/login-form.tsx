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
import { useLogin } from "@/features/auth/features/login/hooks/use-login"
import { type LoginFormType } from "@/features/auth/features/login/schemas/login.schema"

export const LoginForm = () => {
  const { login, isLoading, error, form } = useLogin()

  async function onSubmit(values: LoginFormType) {
    await login(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container space-y-4"
      >
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
        {error && <FormErrorAlert error={error} />}
        <div className="flex justify-center">
          <LoadingButton isLoading={isLoading}>
            {isLoading ? "Logging In..." : "Log In"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
