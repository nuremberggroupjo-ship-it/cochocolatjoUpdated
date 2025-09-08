import { OctagonAlertIcon } from "lucide-react"

import {
  type FormErrorResult,
  isFormErrorArray,
} from "@/lib/helpers/format-error"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FormErrorAlertProps {
  error: FormErrorResult
}

export const FormErrorAlert = ({ error }: FormErrorAlertProps) => {
  if (!error) return null

  if (isFormErrorArray(error)) {
    // Handle array of field errors
    return (
      <Alert variant="destructive" className="bg-destructive/10 border-none">
        <OctagonAlertIcon className="!text-destructive size-4" />
        <AlertTitle>Form Validation Error</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 list-disc pl-5">
            {error.map((err, index) => (
              <li key={index} className="text-sm">
                {err.message}
                {/* {err.field ? <strong>{err.field}:</strong> : ""} {err.message} */}
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    )
  } else {
    // Handle simple string error
    return (
      <Alert variant="destructive" className="bg-destructive/10 border-none">
        <OctagonAlertIcon className="!text-destructive size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }
}
