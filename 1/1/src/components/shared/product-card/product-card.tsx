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
    // Fixed card height per breakpoint so all cards match
    <li className="group/product-card border-border/50 relative flex flex-col overflow-hidden rounded-lg border shadow h-[28rem] sm:h-[30rem] md:h-[36rem]">
      {/* image container: take half of the card height so all images are the same size */}
      <Link
        href={href}
        className="relative w-full overflow-hidden h-1/2"
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

      {/* content: fill remaining space and keep action buttons bottom-aligned */}
      <div className="flex flex-1 flex-col justify-between gap-y-2 p-4">
        <div className="flex items-start justify-between gap-y-2 md:flex-row">
          {/* Title - take available space so price lines up at the right */}
          <Link
            href={href}
            className="flex-1 group-hover/product-card:text-primary line-clamp-1 text-base font-semibold tracking-wide duration-200 sm:text-sm md:text-lg"
          >
            {name}
          </Link>

          {/* Price */}
          <div className="ml-3 mb-1 flex flex-col items-end gap-0.5 whitespace-nowrap text-right">
            {isDiscountActive && discountPrice ? (
              <>
                <span className="text-muted-foreground text-[11px] sm:text-xs md:text-sm line-through">
                  {price.toString()} JOD
                </span>

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
        
        {/* Description - give a minimum height so cards remain aligned when short text or missing size */}
        <p className="text-muted-foreground mb-2 line-clamp-2 text-sm sm:text-xs md:text-sm min-h-[2.25rem]">
          {shortDescription}
        </p>

        {/* size and unit - keep reserved vertical space so presence/absence doesn't shift other elements */}
        {size ? (
          <div className="text-black mb-1 inline-flex items-baseline gap-1">
            Size:
            <span className="font-semibold">{size}{unit}</span>
          </div>
        ) : (
          // invisible placeholder to preserve spacing when size is not present
          <div className="mb-1 min-h-[1.25rem]"></div>
        )}

        {/* Action buttons - stay at bottom */}
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
