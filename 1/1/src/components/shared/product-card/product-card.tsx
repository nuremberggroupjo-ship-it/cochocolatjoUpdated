import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

import type { ProductData } from "@/types/db"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { CartActionButton } from "@/components/shared/cart-action-button"
import { FavoriteActionButton } from "@/components/shared/favorite-action-button"

import { AttributeList } from "./components"

interface ProductCardProps extends ProductData {
  baseHref?: string
}

export const ProductCard: FC<ProductCardProps> = ({
  name,
  shortDescription,
  price,
  attributes,
  slug,
  productImages,
  id,
  favorites,
  isDiscountActive,
  discountPrice,
  size,
  unit,
  baseHref = "/products",
  cartItems,
  stock,
}) => {
  const href = `${baseHref}/${slug}`
  const src = productImages[0]?.imageUrl
  const discountPercentage =
    ((Number(price) - Number(discountPrice)) / Number(price)) * 100

  return (
    <li className="group/product-card border-border/50 relative flex flex-col overflow-hidden rounded-lg border shadow sm:h-56 md:h-140">
      {/* image container with fixed height */}
      <Link
        href={href}
        className="relative h-48 w-full overflow-hidden sm:h-56 md:h-64"
      >
        <Image
          src={src}
          alt={`${name} product image`}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition-transform duration-300 group-hover/product-card:scale-105"
          priority
        />
      </Link>

      {/* discount badge */}
      {isDiscountActive && (
        <Badge
          variant="gradientDestructive"
          className="absolute top-2 right-2 z-10 font-semibold tracking-widest"
        >
          {discountPercentage.toFixed(0)}%
        </Badge>
      )}

      {/* content */}
      <div className="flex flex-1 flex-col gap-y-2 p-4">
        <div className="flex flex-col justify-between gap-y-2 md:flex-row">
          {/* Title */}
          <Link
            href={href}
            className="group-hover/product-card:text-primary line-clamp-1 text-base font-semibold tracking-wide duration-200 sm:text-sm md:text-lg"
          >
            {name}
          </Link>

          {/* Price - mobile defaults are small */}
          <div className="mb-1 flex flex-col items-end gap-0.5 whitespace-nowrap text-right">
            {isDiscountActive && discountPrice ? (
              <>
                {/* original price: very small on mobile, slightly larger on sm/md */}
                <span className="text-muted-foreground text-[11px] sm:text-xs md:text-sm line-through">
                  {price.toString()} JOD
                </span>

                {/* discounted price: small on mobile, grows on larger screens */}
                <span className="text-red-600 text-sm sm:text-base md:text-lg font-semibold">
                  {discountPrice.toString()} JOD
                </span>
              </>
            ) : (
              <span className="text-primary text-sm sm:text-base md:text-lg font-semibold">
                {price.toString()} JOD
              </span>
            )}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm sm:text-xs md:text-sm">
          {shortDescription}
        </p>

        {/* size and unit */}
        {size && (
          <div className="text-black mb-1 inline-flex items-baseline gap-1">
            Size:
            <span className="font-semibold">{size}{unit}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto flex flex-row gap-2 sm:flex-row sm:gap-1 md:flex-row md:gap-2">
          <CartActionButton
            productId={id}
            showText
            isOutOfStock={!stock}
            className="flex-1"
            initialState={{
              inCart: !!(cartItems && cartItems.length > 0),
              quantity:
                cartItems && cartItems.length > 0 ? cartItems[0].quantity : 0,
            }}
          />
          <FavoriteActionButton
            productId={id}
            initialState={{
              isFavorite: !!(favorites && favorites.length > 0),
            }}
          />
        </div>
      </div>

      {attributes.length > 0 && (
        <>
          <Separator className="bg-border/50 mx-auto w-[80%]" />
          <AttributeList attributes={attributes} />
        </>
      )}
    </li>
  )
}
