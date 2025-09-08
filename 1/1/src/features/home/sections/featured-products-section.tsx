"use client"

import Link from "next/link"
import { FC } from "react"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import type { ProductData } from "@/types/db"

import { cn } from "@/lib/utils"

import { useCarousel } from "@/hooks/use-carousel"
import { useIsMobile } from "@/hooks/use-mobile"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import { ProductCard } from "@/components/shared/product-card"

import { SectionWrapper } from "@/features/home/components/section-wrapper"

interface FeaturedProductsSectionProps {
  featuredProducts: ProductData[]
}

export const FeaturedProductsSection: FC<FeaturedProductsSectionProps> = ({
  featuredProducts,
}) => {
  const { setCarouselApi, scrollNext, scrollPrev, isAtStart, isAtEnd } =
    useCarousel()

  const isMobile = useIsMobile()

  return (
    <SectionWrapper title="Featured products">
      <div className="mx-auto md:max-w-[90%]">
        <div className="flex items-center justify-between">
          {/* Navigation Arrows */}
          {((isMobile && featuredProducts.length > 1) ||
            featuredProducts.length > 4) && (
            <div className="flex items-center gap-2">
              <Button
                onClick={scrollPrev}
                className="hover:bg-primary bg-primary/70 flex size-8 items-center rounded-full p-0 shadow-none md:size-10"
                disabled={isAtStart}
                aria-label="Previous slide"
              >
                <ChevronLeftIcon
                  className="text-muted size-6 md:size-8"
                  strokeWidth={1.5}
                />
              </Button>
              <Button
                onClick={scrollNext}
                className="hover:bg-primary bg-primary/70 flex size-8 items-center rounded-full p-0 shadow-none md:size-10"
                disabled={isAtEnd}
                aria-label="Next slide"
              >
                <ChevronRightIcon
                  className="text-muted size-6 md:size-8"
                  strokeWidth={1.5}
                />
              </Button>
            </div>
          )}

          <Link
            href="/shop-now"
            className={cn(
              "relative ml-auto pb-[1px] text-sm font-bold md:text-base",
              "after:bg-primary/60 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-1/2 after:transition-all after:duration-300 hover:after:w-full",
            )}
          >
            View All
          </Link>
        </div>
        <Carousel
          setApi={setCarouselApi}
          opts={{ align: "start" }}
          className="mt-4 w-full"
        >
          <CarouselContent>
            {featuredProducts.map((product, index) => (
              <CarouselItem
                key={index}
                className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard {...product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </SectionWrapper>
  )
}
