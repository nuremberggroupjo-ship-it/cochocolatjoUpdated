import { APIError } from "better-auth/api"
import { ZodError } from "zod"

import { type AuthErrorCode } from "@/lib/auth"

export interface FormError {
  field: string | null
  message: string
}

export type FormErrorResult = FormError[] | string | null | undefined

/**
 * Formats an error into a standardized structure for form errors.
 * Handles Zod validation errors, Better Auth API errors, and generic errors.
 *
 * @param error - The error to format, can be of any type.
 * @returns A standardized error format suitable for form handling.
 */
export default function formatError(error: unknown): FormErrorResult {
  // Handle ZodError (validation errors)
  if (error instanceof ZodError) {
    return error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }))
  }

  // Handle Better Auth Errors
  if (error instanceof APIError) {
    const errCode = error.body ? (error.body.code as AuthErrorCode) : "UNKNOWN"

    switch (errCode) {
      default:
        return [
          {
            field: null,
            message: error.message || "An unexpected error occurred",
          },
        ]
    }
  }

  // Handle regular Error objects
  if (error instanceof Error) {
    return error.message
  }

  // Handle string errors
  if (typeof error === "string") {
    return error
  }

  // Default case
  return "An unexpected error occurred"
}

export function isFormErrorArray(error: FormErrorResult): error is FormError[] {
  return Array.isArray(error)
}
