
import { FC, Suspense } from "react"


import { Skeleton } from "@/components/ui/skeleton"

import { Loader } from "@/components/shared/loader"
import FilterIconInHomePage from "./components/filterIconInHomePage"
import {
  CartLinkWrapper,
  FavoritesLinkIcon,
  Logo,
  MobileLogo,
  MobileSheet,
  Navbar,
  Search,
  UserAuthButton,
} from "./components"

export const ShopHeader: FC = async () => {
  
  return (
    <>
      <header className="border-border/50 bg-background sticky top-0 z-50 border-b py-1 lg:relative lg:border-0 lg:py-4">
        <div className="relative">
          <div className="container">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div className="flex items-center gap-6">
                {/* Hamburger + Mobile sheet */}
                <MobileSheet />

                {/* Search */}
                <Suspense fallback={<Skeleton className="h-8 w-64" />}>
                  <Search />
                  <FilterIconInHomePage/>

                </Suspense>
              </div>

              {/* Mobile Logo */}
              <MobileLogo />

              {/* Right Side */}
              <div className="flex items-center gap-6">
                {/* Sign in label + icon */}
                <UserAuthButton />

                {/* Favorites Icon */}
                <FavoritesLinkIcon />

                {/* Cart Icon  */}
                <Suspense
                  fallback={<Loader className="text-muted-foreground" />}
                >
                  {<CartLinkWrapper />}
                </Suspense>
              </div>
            </div>

            {/* Desktop Logo */}
            <Logo />
          </div>
        </div>
      </header>
      <Navbar>
        <div className="bg-border mx-4 h-full w-[1px]" />
        <FavoritesLinkIcon />
        <div className="bg-border mx-4 h-full w-[1px]" />
        <div className="mr-2">
          <Suspense fallback={<Loader className="text-muted-foreground" />}>
            {<CartLinkWrapper />}
          </Suspense>
        </div>
      </Navbar>
    </>
  )
}
