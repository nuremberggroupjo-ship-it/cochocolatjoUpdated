"use client"

import { usePathname, useRouter } from "next/navigation"
import { FC, useActionState, useOptimistic } from "react"

import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"

import { CartInfo } from "@/types"

import { Button } from "@/components/ui/button"

import { addToCart } from "@/features/cart/actions/add-to-cart.action"
import { removeFromCart } from "@/features/cart/actions/remove-from-cart.action"
import { updateQuantity } from "@/features/cart/actions/update-quantity.action"

import { ButtonWithTooltip } from "./button-with-tooltip"

type UpdateType = "plus" | "minus" | "delete" | "add"

interface CartActionButtonProps {
  productId: string
  initialState: CartInfo
  isOutOfStock?: boolean
  showText?: boolean
  className?: string
}

function cartReducer(state: CartInfo, action: { type: UpdateType }): CartInfo {
  switch (action.type) {
    case "add":
      return { inCart: true, quantity: 1 }
    case "plus":
      return { inCart: true, quantity: state.quantity + 1 }
    case "minus":
      const newQuantity = state.quantity - 1
      return newQuantity <= 0
        ? { inCart: false, quantity: 0 }
        : { inCart: true, quantity: newQuantity }
    case "delete":
      return { inCart: false, quantity: 0 }
    default:
      return state
  }
}

export const CartActionButton: FC<CartActionButtonProps> = ({
  productId,
  initialState,
  isOutOfStock = false,
  showText,
  className,
}) => {
  const router = useRouter()
  const pathname = usePathname()

  const toastAction =
    pathname !== "/cart"
      ? {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        }
      : undefined

  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialState,
    cartReducer,
  )

  // Server actions with useActionState for proper error handling
  const [, addFormAction] = useActionState(async () => {
    const { success, message } = await addToCart(productId, 1)
    if (success) {
      toast.success(message, {
        action: toastAction,
      })
    } else {
      toast.error(message)
    }
  }, null)

  const [, updateFormAction] = useActionState(
    async (prevState: unknown, increment: boolean) => {
      const { success, message } = await updateQuantity(productId, increment)

      if (success) {
        toast.success(message, {
          action: toastAction,
        })
      } else {
        toast.error(message)
      }
    },
    null,
  )

  const [, removeFormAction] = useActionState(async () => {
    const { success, message } = await removeFromCart(productId)
    if (success) {
      toast.success(message)
    } else {
      toast.error(message)
    }
  }, null)

  // If not in cart, show "Add to Cart" button
  if (!optimisticCart.inCart) {
    return (
      <form
        action={async () => {
          updateOptimisticCart({ type: "add" })
          addFormAction()
        }}
        className={className}
      >
        <Button
          type="submit"
          size={showText ? "default" : "icon"}
          className="h-8 w-full md:h-9"
          disabled={isOutOfStock}
        >
          {showText && (
            <span>{isOutOfStock ? "Out of Stock" : "Add to cart"}</span>
          )}
        </Button>
      </form>
    )
  }

  // If in cart, show quantity controls
  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>
      <form
        action={async () => {
          updateOptimisticCart({ type: "minus" })
          if (optimisticCart.quantity === 1) {
            removeFormAction()
          } else {
            updateFormAction(false)
          }
        }}
      >
        <ButtonWithTooltip
          type="submit"
          variant="outline"
          className="size-8 md:size-9"
          disabled={isOutOfStock || optimisticCart.quantity <= 0}
          tooltipContent="Remove one"
          aria-label="Remove one from cart"
        >
          <Minus className="size-4" />
        </ButtonWithTooltip>
      </form>

      <div className="bg-background flex h-8 w-full min-w-8 items-center justify-center rounded-md border text-sm font-medium shadow-xs md:h-9 md:min-w-9">
        {optimisticCart.quantity}
      </div>

      <form
        action={async () => {
          updateOptimisticCart({ type: "plus" })
          updateFormAction(true)
        }}
      >
        <ButtonWithTooltip
          type="submit"
          variant="outline"
          className="size-8 md:size-9"
          disabled={isOutOfStock}
          tooltipContent="Add one more"
          aria-label="Add one more to cart"
        >
          <Plus className="size-4" />
        </ButtonWithTooltip>
      </form>
    </div>
  )
}
