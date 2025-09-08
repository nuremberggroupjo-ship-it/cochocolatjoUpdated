"use client"

import { CopyIcon } from "lucide-react"

import { handleCopyInfo } from "@/lib/utils"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"

interface CopyButtonProps {
  text: string
  label: string
}

export const CopyButton = ({ text, label }: CopyButtonProps) => {
  return (
    <ButtonWithTooltip
      tooltipContent={`Copy ${label}`}
      className="h-8 w-8 p-0"
      onClick={() => handleCopyInfo(text, label)}
    >
      <CopyIcon className="size-4" />
    </ButtonWithTooltip>
  )
}
