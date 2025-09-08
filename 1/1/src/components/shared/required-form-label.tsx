import { FC } from "react"

import { FormLabel } from "@/components/ui/form"

interface RequiredFormLabelProps {
  label: string
}

export const RequiredFormLabel: FC<RequiredFormLabelProps> = ({ label }) => {
  return (
    <FormLabel>
      {label} <span className="text-destructive">*</span>
    </FormLabel>
  )
}
