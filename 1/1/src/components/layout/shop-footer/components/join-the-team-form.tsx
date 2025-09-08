"use client"

import { FC } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { LoadingButton } from "@/components/shared/loading-button"

import { sendEmailAction } from "@/features/email/lib/email.actions"
import {
  type EmailSchema,
  emailSchema,
} from "@/features/email/lib/email.schema"

export const JoinTheTeamForm: FC = () => {
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  })

  const { execute, isPending } = useAction(sendEmailAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      form.reset()
    },
    onError(args) {
      if (args.error.validationErrors) {
        const firstErrors = Object.entries(args.error.validationErrors)
          .map(([, errors]) => errors?.[0]) // Get only the first error for each field
          .filter(Boolean)

        toast.error(
          <ul className="list-disc pl-5">
            {firstErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>,
        )
        return
      }

      toast.error(args.error.serverError)
    },
  })

  function onSubmit(values: EmailSchema) {
    execute(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Message"
                  className="max-h-28 resize-none"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" isLoading={isPending}>
          {isPending ? "Sending..." : "Send"}
        </LoadingButton>
      </form>
    </Form>
  )
}
