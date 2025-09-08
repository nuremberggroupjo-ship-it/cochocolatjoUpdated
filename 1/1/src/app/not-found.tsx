import Link from "next/link"

import { Home, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md p-8 text-center">
        {/* Large 404 */}
        <div className="from-primary to-primary/50 mb-4 bg-gradient-to-r bg-clip-text text-9xl font-black text-transparent">
          404
        </div>

        {/* Chocolate emoji */}
        <div className="mb-6 animate-bounce text-6xl">🍫</div>

        {/* Text */}
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Sweet! But Not Found
        </h1>
        <p className="mb-8 text-gray-600">
          This page has melted away like chocolate in the sun.
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <Button asChild className="w-full" aria-label="Shop Chocolates">
            <Link
              href="/shop-now"
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop Chocolates
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
