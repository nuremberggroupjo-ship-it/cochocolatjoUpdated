import { ShopFooter } from "@/components/layout/shop-footer"
import { ShopHeader } from "@/components/layout/shop-header"

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <ShopHeader />
      {children}
      <ShopFooter />
    </div>
  )
}
