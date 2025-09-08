import React from "react"
import { getProductBySlugPublic } from "@/data"
import { Separator } from "@/components/ui/separator"
import { RichTextDisplay } from "@/features/admin/components/shared/rich-text-editor/components/rich-text-display"
import { AttributesTable } from "./attributes-table"
import { ProductDetails } from "./product-details"
import { ProductPreviewImages } from "./product-preview-images"

interface SingleProductPageWrapperProps {
  params: { slug: string | string[] } | Promise<{ slug: string | string[] }>
}

// Type guard to check if object is a Promise
function isPromise<T>(obj: T | Promise<T>): obj is Promise<T> {
  return !!obj && typeof (obj as Promise<T>).then === "function"
}

/**
 * Server component — can be async.
 * Accepts either a Promise-wrapped params (legacy) or a plain object.
 */
export const SingleProductPageWrapper = async ({
  params,
}: SingleProductPageWrapperProps): Promise<React.ReactNode | null> => {
  const resolvedParams = isPromise(params) ? await params : params

  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug

  const product = await getProductBySlugPublic(slug)
  if (!product) return null

  return (
    <section className="mx-auto py-4 lg:container lg:px-0 lg:py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">
        <ProductPreviewImages images={product.productImages} />
        <ProductDetails
          category={product.category}
          ingredients={product.ingredients}
          name={product.name}
          price={product.price}
          discountPrice={product.discountPrice}
          isDiscountActive={product.isDiscountActive}
          shortDescription={product.shortDescription}
          stock={product.stock}
          id={product.id}
          favorites={product.favorites}
          cartItems={product.cartItems}
          size={product.size}
          unit={product.unit}
        />
      </div>

      <Separator className="bg-border/50 my-8" />

      <div className="flex w-full flex-col space-y-4 lg:space-y-6">
        <AttributesTable attributes={product.attributes} />
        <RichTextDisplay content={product.description} />
      </div>
    </section>
  )
}
