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
  const src = productImages[0]?.imageUrl
  const discountPercentage =
    ((Number(price) - Number(discountPrice)) / Number(price)) * 100

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
      {isDiscountActive && (
        <Badge
          variant="gradientDestructive"
          className="absolute top-2 right-2 z-10 font-semibold tracking-widest"
        >
          {discountPercentage.toFixed(0)}%
        </Badge>
      )}

      {/* Content (under image) */}
      <div className="flex flex-col justify-between flex-1 p-4  ">
        {/* Name + Price in one row */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={href}
            className="flex-1 group-hover/product-card:text-primary text-sm sm:text-sm md:text-base lg:text-base xl:text-xl font-semibold tracking-wide duration-200 break-words"
          >
            {name}
          </Link>

          <div className="flex flex-col items-end whitespace-nowrap text-right">
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
        </div>

        {/* Size */}
        {size ? (
          <div className="text-black inline-flex items-baseline gap-1 text-xs sm:text-xs md:text-base lg:text-base xl:text-lg">
            Size: <span className="font-semibold text-xs sm:text-xs md:text-base lg:text-base xl:text-lg">{size}{unit}</span>
          </div>
        ) : (
          <div className="min-h-[1.25rem]" />
        )}

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
