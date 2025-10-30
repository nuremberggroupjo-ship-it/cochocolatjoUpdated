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
  const src = productImages?.[0]?.imageUrl ?? "/placeholder.png"
  const discountPercentage =
    discountPrice && Number(price) > 0
      ? ((Number(price) - Number(discountPrice)) / Number(price)) * 100
      : 0

  return (
    <li className="group/product-card border-border/50 relative flex flex-col overflow-hidden rounded-lg border shadow h-[28rem] sm:h-[28rem] md:h-[32rem]">
      {/* Image container */}
      <Link href={href} className="relative w-full overflow-hidden h-[55%]">
        <Image
          src={src}
          alt={`${name} product image`}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition-transform duration-300 group-hover/product-card:scale-105"
          priority
        />
      </Link>

      {/* Discount badge */}
      {isDiscountActive && discountPrice && (
        <Badge
          variant="gradientDestructive"
          className="absolute top-2 right-2 z-10 font-semibold tracking-widest"
        >
          {discountPercentage.toFixed(0)}%
        </Badge>
      )}

      {/* Content (under image) */}
      <div className="flex flex-col justify-between flex-1 p-4">
        {/* Name + (price+size responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
          {/* LEFT: Name + (size on md+) */}
          <div>
            <Link
              href={href}
              className="block font-semibold text-sm sm:text-sm md:text-base lg:text-base xl:text-xl break-words group-hover/product-card:text-primary transition-colors duration-200"
            >
              {name}
            </Link>

            {/* Size shown under the name on md+ (keeps original behavior) */}
            {size ? (
              <div className="hidden md:inline-flex items-baseline gap-1 text-xs sm:text-xs md:text-base lg:text-base xl:text-lg mt-1 text-black">
                <span className="text-muted-foreground text-xs md:text-sm">Size:</span>
                <span className="font-semibold text-xs sm:text-xs md:text-base lg:text-base xl:text-lg">
                  {size}
                  {unit}
                </span>
              </div>
            ) : (
              <div className="hidden md:min-h-[1.25rem]" />
            )}
          </div>

          {/* RIGHT (md+): Price (keeps original right-aligned price on larger screens) */}
          <div className="hidden md:flex flex-col items-end whitespace-nowrap text-right">
            {isDiscountActive && discountPrice ? (
              <>
                <span className="text-muted-foreground text-[11px] sm:text-xs line-through">
                  {price.toString()} JOD
                </span>
                <span className="text-red-600 text-sm sm:text-base font-semibold">
                  {discountPrice.toString()} JOD
                </span>
              </>
            ) : (
              <span className="text-primary text-sm sm:text-base font-semibold">
                {price.toString()} JOD
              </span>
            )}
          </div>

          {/* SMALL SCREENS ONLY: Price stacked above Size (column) */}
          <div className="flex flex-col md:hidden gap-1 mt-1 mb-5">
            <div className="flex flex-col">
              {isDiscountActive && discountPrice ? (
                <>
                  <span className="text-muted-foreground text-[12px] line-through">
                    {price.toString()} JOD
                  </span>
                  <span className="text-red-600 text-lg sm:text-xl font-semibold leading-tight">
                    {discountPrice.toString()} JOD
                  </span>
                </>
              ) : (
                <span className="text-primary text-lg sm:text-xl font-semibold">
                  {price.toString()} JOD
                </span>
              )}
            </div>

            {size ? (
              <div className="text-muted-foreground text-sm">
                <span className="text-black text-sm mr-1 font-semibold ">Size:</span>
                <span className="font-semibold text-xs">
                  {size}
                  {unit}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-2">
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

      {/* Attributes (bottom divider) */}
      {attributes.length > 0 && (
        <>
          <Separator className="bg-border/50 mx-auto w-[80%]" />
          <AttributeList attributes={attributes} />
        </>
      )}
    </li>
  )
}
