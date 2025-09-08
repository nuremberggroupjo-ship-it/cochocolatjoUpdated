import { FC } from "react"

import { getCartCount } from "@/data"

import { CartLinkIcon } from "./cart-link-icon"

export const CartLinkWrapper: FC = async () => {
  const count = await getCartCount()

  return <CartLinkIcon count={count} />
}
