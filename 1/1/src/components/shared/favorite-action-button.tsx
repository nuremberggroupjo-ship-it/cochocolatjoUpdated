"use client"

import { usePathname, useRouter } from "next/navigation"
import { FC, useOptimistic, useTransition } from "react"

import { HeartIcon } from "lucide-react"
import { toast } from "sonner"

import { FavoriteInfo } from "@/types"

import { cn } from "@/lib/utils"

import { Button, ButtonProps } from "@/components/ui/button"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"

import { toggleFavorite } from "@/features/favorites/actions/toggle-favorite.action"

interface FavoriteActionButtonProps {
  productId: string
  initialState: FavoriteInfo
  showText?: boolean
  className?: string
}

export const FavoriteActionButton: FC<FavoriteActionButtonProps> = ({
  productId,
  initialState,
  showText = false,
  className,
}) => {
  const pathname = usePathname()
  const router = useRouter()

  // Optimistic state
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    initialState.isFavorite,
  )
  const [, startTransition] = useTransition()

  const toastAction =
    pathname !== "/favorites"
      ? {
          label: "Go to Favorites",
          onClick: () => router.push("/favorites"),
        }
      : undefined

  const handleToggle = () => {
    // Optimistically update UI

    startTransition(async () => {
      setOptimisticFavorite((prev) => !prev)
      const result = await toggleFavorite(productId)

      if (result.success) {
        // Optionally update again with server result
        setOptimisticFavorite(result.result?.isFavorite as boolean)
        toast.success(result.message, {
          action: toastAction,
        })
      } else {
        // Rollback optimistic update on error
        setOptimisticFavorite(initialState.isFavorite)
        toast.error(result.message)
      }
    })
  }

  const buttonInfo = {
    onClick: handleToggle,
    variant: "outline",
    size: showText ? "default" : "icon",
    className: cn(
      "cursor-pointer transition-colors duration-200 ",
      optimisticFavorite && "text-destructive hover:text-destructive/80",
      showText ? "h-8 md:h-9" : "size-8 md:size-9",
      className,
    ),
    "aria-label": optimisticFavorite
      ? "Remove from favorites"
      : "Add to favorites",
  } as ButtonProps

  // Derived values to avoid repetition
  const isLiked = optimisticFavorite
  const actionText = isLiked ? "Remove from favorites" : "Add to favorites"

  const FavoriteIcon = (
    <HeartIcon
      className={cn(
        "size-5 transition-all duration-200",
        showText && "hidden md:block",
        isLiked
          ? "fill-current stroke-current"
          : "fill-none stroke-current stroke-[1.5]",
      )}
    />
  )

  const buttonContent = (
    <>
      {FavoriteIcon}
      {showText && <span>{actionText}</span>}
    </>
  )

  // Single return with conditional wrapper
  const ButtonComponent = showText ? Button : ButtonWithTooltip
  const extraProps = showText ? {} : { tooltipContent: actionText }

  return (
    <ButtonComponent {...buttonInfo} {...extraProps}>
      {buttonContent}
    </ButtonComponent>
  )
}
