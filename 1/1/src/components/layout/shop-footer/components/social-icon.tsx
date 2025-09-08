import Link from "next/link"
import { FC } from "react"

import type { SocialLink } from "@/types"

import { Button } from "@/components/ui/button"

import { AppTooltip } from "@/components/shared/app-tooltip"
import { SvgIcon } from "@/components/shared/svg-icon"

export const SocialIcon: FC<Omit<SocialLink, "id">> = ({
  icon,
  name,
  href,
}) => {
  return (
    <AppTooltip
      trigger={
        <Link href={href} target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            size="icon"
            className="bg-primary/30 hover:bg-primary/20 rounded-full border-0 transition-colors duration-300"
          >
            <SvgIcon icon={icon} className="size-5" />
            <span className="sr-only">{name}</span>
          </Button>
        </Link>
      }
    >
      <p>{name}</p>
    </AppTooltip>
  )
}
