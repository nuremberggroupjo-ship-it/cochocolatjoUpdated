export type CartItemType = {
  quantity: number
  productId: string
  product: {
    id: string
    name: string
    slug: string
    price: number | string
    discountPrice: number | string | null
    isDiscountActive: boolean
    stock: number
    shortDescription: string
    productImages: { imageUrl: string }[]
  }
}
