"use client"

import Image from "next/image"
import { FC } from "react"

import { ProductData } from "@/types/db"

import { cn } from "@/lib/utils"

import { useCarousel } from "@/hooks/use-carousel"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import { ImageMagnifier } from "@/components/shared/image-magnifier"

interface ProductPreviewImagesProps {
  images: ProductData["productImages"]
}

export const ProductPreviewImages: FC<ProductPreviewImagesProps> = ({
  images,
}) => {
  const {
    setCarouselApi: setCarouselApiDesktop,
    currentIndex: currentIndexDesktop,
    scrollToIndex: scrollToIndexDesktop,
  } = useCarousel()
  const {
    setCarouselApi: setCarouselApiTablet,
    currentIndex: currentIndexTablet,
    scrollToIndex: scrollToIndexTablet,
  } = useCarousel()
  const {
    setCarouselApi: setCarouselApiMobile,
    currentIndex: currentIndexMobile,
    scrollToIndex: scrollToIndexMobile,
  } = useCarousel()

  return (
    <div className="w-full md:col-span-2">
      {/* Thumbnail Carousel */}
      <div className="hidden lg:flex lg:gap-4">
        {/* Vertical Thumbnail Carousel - Left Side (Desktop Only) */}
        {images.length > 1 && (
          <div className="w-20 flex-shrink-0">
            <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
              {images.map(({ id, imageUrl }, index) => (
                <div
                  key={id}
                  className={cn(
                    "relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200",
                    currentIndexDesktop === index
                      ? "border-primary opacity-100"
                      : "hover:border-primary/50 border-border opacity-60 hover:opacity-80",
                  )}
                  onClick={() => scrollToIndexDesktop(index)}
                >
                  <Image
                    src={imageUrl}
                    alt={`Product thumbnail ${index + 1}`}
                    fill
                    priority
                    className="object-cover"
                    unoptimized
                  />

                 
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Image Carousel */}
        <div className="flex-1">
          <Carousel
            setApi={setCarouselApiDesktop}
            opts={{
              loop: true,
            }}
            className="w-full"
          >

            
            <CarouselContent>
              {images.map(({ id, imageUrl }) => (
                <CarouselItem key={id} className="flex items-center">
                  <div className="w-full">
                    <div className="relative flex aspect-[10/11] w-full items-center overflow-hidden">
                      <ImageMagnifier
                        src={imageUrl}
                        alt={`Product image ${id}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Tablet Layout (md) with Horizontal Thumbnails */}
      <div className="hidden md:block lg:hidden">
        <Carousel
          setApi={setCarouselApiTablet}
          opts={{
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {images.map(({ id, imageUrl }) => (
              <CarouselItem key={id}>
                <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                  <Image
                    src={imageUrl}
                    alt={`Product image ${id}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 50vw"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Horizontal Thumbnail Grid for Tablet */}
        {images.length > 1 && (
          <div className="mt-4">
            <div className="flex justify-center gap-2">
              {images.map(({ id, imageUrl }, index) => (
                <div
                  key={id}
                  className={cn(
                    "relative aspect-square h-16 w-16 cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200",
                    currentIndexTablet === index
                      ? "border-primary opacity-100"
                      : "border-border opacity-60 hover:opacity-80",
                  )}
                  onClick={() => scrollToIndexTablet(index)}
                >
                  <Image
                    src={imageUrl}
                    alt={`Product thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    priority
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <Carousel
          setApi={setCarouselApiMobile}
          opts={{
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {images.map(({ id, imageUrl }, index) => (
              <CarouselItem key={id}>
                <div className="mx-auto w-full max-w-xs sm:max-w-sm">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                    <Image
                      src={imageUrl}
                      alt={`Product image ${id}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 320px, 384px"
                      priority={index === 0}
                      unoptimized
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Mobile Thumbnail Grid */}
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: images.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndexMobile(index)}
                className={cn(
                  "h-2.5 w-2.5 cursor-pointer rounded-full md:h-3 md:w-3",
                  currentIndexMobile === index ? "bg-primary" : "bg-muted",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
