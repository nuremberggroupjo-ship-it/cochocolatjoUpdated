import { useCallback, useEffect, useState } from "react"

import { type CarouselApi } from "@/components/ui/carousel"

export const useCarousel = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [totalSlides, setTotalSlides] = useState(0)

  useEffect(() => {
    if (!carouselApi) return

    const updateCarouselState = () => {
      const selectedIndex = carouselApi.selectedScrollSnap()
      const items = carouselApi.scrollSnapList().length

      setCurrentIndex(selectedIndex)
      setTotalSlides(items)
    }

    updateCarouselState()

    carouselApi.on("select", updateCarouselState)

    return () => {
      carouselApi.off("select", updateCarouselState) // Clean up on unmount
    }
  }, [carouselApi])

  // Memoize functions to prevent unnecessary rerenders
  const scrollToIndex = useCallback(
    (index: number) => {
      carouselApi?.scrollTo(index)
    },
    [carouselApi],
  )

  const scrollNext = useCallback(() => {
    carouselApi?.scrollNext()
  }, [carouselApi])

  const scrollPrev = useCallback(() => {
    carouselApi?.scrollPrev()
  }, [carouselApi])

  const isAtStart = currentIndex === 0
  const isAtEnd = currentIndex === totalSlides - 1

  return {
    carouselApi,
    setCarouselApi,
    currentIndex,
    totalSlides,
    setCurrentIndex,
    scrollToIndex,
    scrollNext,
    scrollPrev,
    isAtStart,
    isAtEnd,
  }
}
