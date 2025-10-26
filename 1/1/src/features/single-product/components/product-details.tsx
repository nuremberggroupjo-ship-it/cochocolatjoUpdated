import Link from "next/link"
import { FC } from "react"

import { ProductData } from "@/types/db"

import { Badge } from "@/components/ui/badge"

import { CartActionButton } from "@/components/shared/cart-action-button"
import { FavoriteActionButton } from "@/components/shared/favorite-action-button"

export const ProductDetails: FC<
  Pick<
    ProductData,
    | "name"
    | "shortDescription"
    | "price"
    | "discountPrice"
    | "isDiscountActive"
    | "stock"
    | "ingredients"
    | "category"
    | "id"
    | "favorites"
    | "cartItems"
    | "size"
    | "unit"
  >
> = ({
  category,
  ingredients,
  name,
  price,
  discountPrice,
  isDiscountActive,
  shortDescription,
  stock,
  id,
  favorites,
  cartItems,
  size,
  unit,
}) => {
  console.log("unit: ", unit)

  return (
    <div className="flex w-full flex-col space-y-4 md:col-span-3 lg:space-y-6">
      {/* Category */}
      <Link
        href={`/categories/${category.slug}`}
        className="text-primary hover:text-primary/80 text-sm font-medium tracking-wider uppercase transition-colors duration-200"
      >
        {category.name}
      </Link>

      {/* Product name */}
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
        {name}
      </h1>

      {/* Short description */}
      <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
        {shortDescription}
      </p>

      {/* Price and stock */}
      <div className="flex flex-row items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Show discount price if active */}
          {isDiscountActive && discountPrice ? (
            <>
              {/* Discounted price */}
              <span className="from-destructive to-destructive/70  bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent sm:text-2xl md:text-3xl">
                <span> {discountPrice.toString()} JOD </span> 
              </span>
              {/* Original price crossed out */}
              <span className="text-muted-foreground  text-lg font-medium line-through sm:text-xl">
                <span> {price.toString()} JOD</span>
              </span>
            </>
          ) : (
            /* Regular price */
            <span className="text-xl font-bold sm:text-2xl md:text-3xl">
              <span>{price.toString()} JOD</span>
            </span>
          )}
        </div>

        <Badge
          variant={stock ? "success" : "gradientDestructive"}
          className="w-fit text-sm"
        >
          {stock ? "In stock" : "Out of stock"}
        </Badge>
      </div>

      {/* Ingredients */}
      {ingredients && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold md:text-lg">Ingredients</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {ingredients}
          </p>
        </div>
      )}

      {size && (
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold md:text-lg">Size:</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {size} {unit}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex w-full max-w-96 gap-3 pt-4">
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
          className="flex-1"
          showText
          initialState={{
            isFavorite: !!(favorites && favorites.length > 0),
          }}
        />
      </div>
    </div>
  )
}
