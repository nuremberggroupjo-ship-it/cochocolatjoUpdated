import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

import { formatPrice } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

import { CartActionButton } from "@/components/shared/cart-action-button"

import type { CartItemType } from "@/features/cart/types"

interface CartItemProps {
  item: CartItemType
}

export const CartItem: FC<CartItemProps> = ({ item }) => {
  const { product, quantity } = item
  const imageUrl = product.productImages[0]?.imageUrl

  const price =
    product.isDiscountActive && product.discountPrice
      ? Number(product.discountPrice)
      : Number(product.price)

  const originalPrice = Number(product.price)
  const totalPrice = price * quantity
  const discountPercentage = Math.round(
    ((originalPrice - price) / originalPrice) * 100,
  )

  return (
    <div className="group border-border bg-card relative overflow-hidden rounded-xl border p-3 transition-all duration-300 sm:p-4 md:p-3 lg:p-4">
      {/* Mobile Layout */}
      <div className="flex gap-3 sm:gap-4 md:hidden">
        {/* Product Image - Mobile */}
        <Link href={`/products/${product.slug}`} className="flex-shrink-0">
          <div className="bg-muted/50 relative h-16 w-16 overflow-hidden rounded-lg sm:h-20 sm:w-20">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 375px) 64px, (max-width: 768px) 80px, 80px"
              className="object-cover transition-all duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>
        </Link>

        {/* Content - Mobile */}
        <div className="min-w-0 flex-1 space-y-2">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/products/${product.slug}`} className="min-w-0 flex-1">
              <h3 className="text-foreground hover:text-primary line-clamp-1 text-sm font-semibold transition-colors sm:text-base">
                {product.name}
              </h3>
            </Link>

            {/* Price - Mobile */}
            <div className="flex flex-col items-end text-right">
              {product.isDiscountActive && product.discountPrice ? (
                <>
                  <span className="from-destructive to-destructive/70 bg-gradient-to-r bg-clip-text text-sm font-bold text-transparent sm:text-base">
                    {formatPrice(totalPrice)}
                  </span>
                  <span className="text-muted-foreground text-xs line-through">
                    {formatPrice(originalPrice * quantity)}
                  </span>
                </>
              ) : (
                <span className="text-foreground text-sm font-bold sm:text-base">
                  {formatPrice(totalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Badge & Unit Price */}
            <div className="flex items-center gap-2">
              {quantity > 1 && (
                <span className="text-muted-foreground text-xs">
                  {formatPrice(price)} each
                </span>
              )}
            </div>

            {/* Quantity Controls - Mobile */}
            <CartActionButton
              productId={product.id}
              showText
              initialState={{ inCart: true, quantity }}
              isOutOfStock={product.stock === 0}
              className="w-24"
            />
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden gap-3 md:flex lg:gap-4">
        {/* Product Image - Desktop */}
        <Link href={`/products/${product.slug}`} className="flex-shrink-0">
          <div className="bg-muted/50 relative h-18 w-18 overflow-hidden rounded-lg lg:h-20 lg:w-20">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 1200px) 72px, 80px"
              className="object-cover transition-all duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>
        </Link>

        {/* Product Info - Desktop */}
        <div className="min-w-0 flex-1 space-y-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-foreground hover:text-primary line-clamp-1 text-base font-semibold transition-colors lg:text-lg">
              {product.name}
            </h3>
          </Link>

          {/* Description with line-clamp */}
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {product.shortDescription}
          </p>

          {/* Badge Row */}
          <div className="flex items-center gap-2 pt-1">
            {product.isDiscountActive && product.discountPrice && (
              <Badge
                variant="gradientDestructive"
                className="h-6 font-semibold"
              >
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Quantity Controls - Desktop */}
        <div className="flex items-center">
          <CartActionButton
            productId={product.id}
            showText={true}
            initialState={{ inCart: true, quantity }}
            isOutOfStock={product.stock === 0}
            className="w-28 lg:w-32"
          />
        </div>

        {/* Price Section - Desktop */}
        <div className="flex min-w-0 flex-col items-end justify-center space-y-1">
          {/* Main Price */}
          {product.isDiscountActive && product.discountPrice ? (
            <>
              <span className="from-destructive to-destructive/70 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent lg:text-xl">
                {formatPrice(totalPrice)}
              </span>
              <span className="text-muted-foreground text-sm line-through lg:text-sm">
                {formatPrice(originalPrice * quantity)}
              </span>
            </>
          ) : (
            <span className="text-foreground text-lg font-bold lg:text-xl">
              {formatPrice(totalPrice)}
            </span>
          )}

          {/* Unit Price */}
          {quantity > 1 && (
            <span className="text-muted-foreground text-xs">
              {formatPrice(price)} each
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
