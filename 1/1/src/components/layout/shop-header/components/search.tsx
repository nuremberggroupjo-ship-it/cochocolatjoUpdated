"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, FormEvent, useEffect, useRef, useState } from "react"

import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Search: FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathName = usePathname()

  const currentSearchTerm = searchParams.get("q") || ""

  const [searchValue, setSearchValue] = useState(currentSearchTerm)
  const [searchBoxVisibility, setSearchBoxVisibility] = useState<boolean>(false)
  const [isClosing, setIsClosing] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchValue(currentSearchTerm)
  }, [currentSearchTerm])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const q = formData.get("q") as string

    if (!q?.trim()) return

    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("q", q.trim().toString())

    let basePath = ""
    if (pathName !== "/shop-now") {
      basePath = "/shop-now"
    }
    router.push(`${basePath}?${newSearchParams.toString()}`)
    handleCancel()
  }

  const handleToggleSearchBox = () => {
    setSearchBoxVisibility((prev) => {
      if (!prev) {
        setIsClosing(false)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      return !prev
    })
  }

  const handleCancel = () => {
    if (inputRef.current) {
      inputRef.current.blur()
    }

    // Start exit animation
    setIsClosing(true)

    // Hide after animation completes
    setTimeout(() => {
      setSearchBoxVisibility(false)
      setIsClosing(false)
    }, 200) // Match your animation duration
  }

  // Show backdrop and search when visible OR when closing (for exit animation)
  const shouldShowElements = searchBoxVisibility || isClosing

  return (
    <>
      {/* Mobile Backdrop with Exit Animation */}
      {shouldShowElements && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/30 lg:hidden",
            // Entry animation
            searchBoxVisibility &&
              !isClosing &&
              "animate-in fade-in-0 duration-200",
            // Exit animation
            isClosing && "animate-out fade-out-0 duration-200",
          )}
          onClick={handleCancel}
        />
      )}

      {/* Mobile Toggle Button */}
      <Button
        className="size-auto !px-0 hover:bg-transparent lg:hidden"
        size="icon"
        aria-label="Toggle Search"
        variant="ghost"
        onClick={handleToggleSearchBox}
      >
        <SearchIcon className="size-5 stroke-[1.5]" />
      </Button>

      {/* Single Search Form with Exit Animation */}
      <form onSubmit={handleSearch} method="GET" action="/shop-now">
        <div
          className={cn(
            // Mobile styles
            "bg-background fixed top-0 right-0 left-0 z-50 border-b p-4 shadow-sm",
            // Entry animation
            searchBoxVisibility && !isClosing && "show-slide",
            // Exit animation
            isClosing && "hide-slide",
            // Hide when not visible and not animating
            !shouldShowElements && "hidden",
            // Desktop styles (always visible)
            "lg:show-slide lg:relative lg:block lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
          )}
        >
          <div className="flex items-center gap-3 lg:gap-0">
            <div className="relative flex-1 lg:w-64">
              <Input
                ref={inputRef}
                name="q"
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pr-12"
              />

              <Button
                type="submit"
                size="icon"
                aria-label="Search"
                className="bg-primary/80 absolute top-1/2 right-1 size-7.5 -translate-y-1/2"
              >
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Cancel button - only visible on mobile */}
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="px-3 text-sm font-medium lg:hidden"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
