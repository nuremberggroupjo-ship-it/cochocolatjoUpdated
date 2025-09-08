"use server"

import { flattenValidationErrors } from "next-safe-action"
import { type CreateEmailOptions, Resend } from "resend"

import { env } from "@/lib/env"
import { actionClient } from "@/lib/safe-action"

import { EmailTemplate } from "@/features/email/components/email-template"
import { emailSchema } from "@/features/email/lib/email.schema"

const resend = new Resend(env.RESEND_API_KEY)

export const sendEmailAction = actionClient
  .metadata({
    actionName: "createDeliveryOrder",
  })
  .inputSchema(emailSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { email, message } = parsedInput

    const emailPayload = {
      from: `Co Chocolat Jo <no-replay@cochocolatjo.com>`,
      to: env.NEXT_PUBLIC_EMAIL,
      subject: "New message from Co Chocolat",
      react: EmailTemplate({ email, message }),
    } satisfies CreateEmailOptions

    const { error: resendError } = await resend.emails.send(emailPayload)

    if (resendError) {
      console.error("Resend error:", resendError)
      return {
        success: false,
        message: resendError.message || "Failed to send email",
      }
    }

    return {
      success: true,
      message: "Email sent successfully",
    }
  })
