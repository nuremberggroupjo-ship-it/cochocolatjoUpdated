"use client"

import { FC, MouseEvent, useCallback, useState } from "react"

import { cn } from "@/lib/utils"

interface ImageMagnifierProps {
  className?: string
  src: string
  alt: string

  magnifierClassName?: string
  magnifierHeight?: number
  magnifierWidth?: number
  zoomLevel?: number
}

export const ImageMagnifier: FC<ImageMagnifierProps> = ({
  className,
  src,
  alt,

  magnifierClassName,
  magnifierHeight = 200,
  magnifierWidth = 200,
  zoomLevel = 2.5,
}) => {
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false)
  const [[imgWidth, imgHeight], setSize] = useState<[number, number]>([0, 0])
  const [[x, y], setXY] = useState<[number, number]>([0, 0])

  const handleMouseEnter = useCallback((e: MouseEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    const { width, height } = el.getBoundingClientRect()
    el.style.cursor = "crosshair"
    setSize([width, height])
    setShowMagnifier(true)
  }, [])

  const handleMouseLeave = useCallback((e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault()
    setShowMagnifier(false)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    const { left, top } = el.getBoundingClientRect()

    const xPos = e.clientX - left
    const yPos = e.clientY - top

    setXY([xPos, yPos])
  }, [])

  return (
    <div className="relative inline-block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn("", className)}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      <div
        className={cn(
          "border-border bg-background pointer-events-none absolute z-50 rounded-full border",
          showMagnifier ? "" : "hidden",
          magnifierClassName,
        )}
        style={{
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifierWidth / 2}px`,
          backgroundImage: `url(${src})`,
          backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
          backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  )
}
