"use client"

import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

import Autoplay from "embla-carousel-autoplay"
// import Fade from "embla-carousel-fade"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Banner } from "@/lib/_generated/prisma"
import { cn } from "@/lib/utils"

import { useCarousel } from "@/hooks/use-carousel"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface HeroSectionProps {
  banners: Banner[]
}

export const HeroSection: FC<HeroSectionProps> = ({ banners }) => {
  const {
    setCarouselApi,
    scrollToIndex,
    currentIndex,
    totalSlides,
    scrollNext,
    scrollPrev,
  } = useCarousel()

  return (
    <section className="group/hero relative">
      {/* Carousel - slider */}
      <Carousel
        setApi={setCarouselApi}
        opts={{
          loop: true,
          containScroll: false,
          //  align: "center"
        }}
        plugins={[
          Autoplay({
            stopOnMouseEnter: true,
            stopOnInteraction: false,
            delay: 5000,
          }),
          // Fade({}),
        ]}
      >
        <CarouselContent>
          {banners.map(({ id, image, name }, index) => (
            <CarouselItem key={id}>
              <div
                className={cn(
                  "relative flex items-center justify-center overflow-hidden",
                  "aspect-[16/9] w-full sm:aspect-[16/8] md:aspect-[16/5.5]",
                  "cursor-grab active:cursor-grabbing",
                )}
              >
                <Image
                  src={image}
                  alt={name}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                  quality={85}
                />

                <Link
                  href="/"
                  className="bg-primary/90 text-primary-foreground hover:bg-background hover:text-primary group-hover/hero:bg-primary relative z-10 cursor-default p-2 text-base transition-all duration-200 md:p-3 md:text-lg lg:p-4 lg:text-2xl"
                >
                  {name}
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-20 hidden items-center justify-between px-3 md:flex",
            "opacity-0 transition-opacity duration-200 group-hover/hero:opacity-100",
          )}
        >
          <Button
            onClick={scrollPrev}
            className="hover:bg-primary bg-primary/50 pointer-events-auto flex size-12 items-center rounded-full p-0 shadow-none lg:size-16"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon
              className="text-muted size-10 lg:size-13"
              strokeWidth={1}
            />
          </Button>
          <Button
            onClick={scrollNext}
            className="hover:bg-primary bg-primary/50 pointer-events-auto size-12 rounded-full p-0 shadow-none lg:size-16"
            aria-label="Next slide"
          >
            <ChevronRightIcon
              className="text-muted size-10 lg:size-13"
              strokeWidth={1}
            />
          </Button>
        </div>
      )}
      {/* Navigation Dots */}
      {totalSlides > 1 && (
        <div className="absolute right-0 bottom-4 left-0 z-20 flex justify-center space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "h-2.5 w-2.5 cursor-pointer rounded-full md:h-3 md:w-3",
                currentIndex === index ? "bg-primary" : "bg-muted",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
