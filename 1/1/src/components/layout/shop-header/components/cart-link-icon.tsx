import Link from "next/link"
import { FC } from "react"

import CartSvg from "@/assets/svg/cart.svg"

import { cn } from "@/lib/utils"

import { AppTooltip } from "@/components/shared/app-tooltip"
import { SvgIcon } from "@/components/shared/svg-icon"

interface CartLinkIconProps {
  count?: number
  className?: string
  spanClassName?: string
}

export const CartLinkIcon: FC<CartLinkIconProps> = ({
  count = 0,
  className,
  spanClassName,
}) => {
  return (
    <AppTooltip
      trigger={
        <Link
          href="/cart"
          className={cn(
            "group/cart-icon relative inline-flex gap-[1px]",
            className,
          )}
        >
          <SvgIcon
            icon={CartSvg}
            className="group-hover/cart-icon:fill-primary fill-muted-foreground transition-colors duration-200"
          />
          {count > 0 && (
            <span
              className={cn(
                "from-destructive to-destructive/70 text-primary-foreground ring-primary-foreground flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r px-1 text-xs font-semibold shadow-lg ring-2",
                "absolute -top-3 right-auto -left-3 sm:-right-3 sm:left-auto",
                count > 99 ? "px-0.5 text-[10px]" : "",
                spanClassName,
              )}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>
      }
    >
      <p>Cart</p>
    </AppTooltip>
  )
}
