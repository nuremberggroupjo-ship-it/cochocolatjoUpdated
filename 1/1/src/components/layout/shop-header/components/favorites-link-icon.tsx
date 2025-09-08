import Link from "next/link"
import { FC } from "react"

import HeartSvg from "@/assets/svg/heart.svg"

import { cn } from "@/lib/utils"

import { AppTooltip } from "@/components/shared/app-tooltip"
import { SvgIcon } from "@/components/shared/svg-icon"

interface FavoritesLinkIconProps {
  className?: string
}

export const FavoritesLinkIcon: FC<FavoritesLinkIconProps> = ({
  className,
}) => {
  return (
    <AppTooltip
      trigger={
        <Link
          href="/favorites"
          className={cn(
            "hover:text-primary text-muted-foreground transition-colors duration-200",
            className,
          )}
        >
          <SvgIcon icon={HeartSvg} />
        </Link>
      }
    >
      <p>Favorites</p>
    </AppTooltip>
  )
}
