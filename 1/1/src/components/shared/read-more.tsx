"use client"

import { FC, ReactNode, useState } from "react"

import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

interface ReadMoreProps {
  /** The text to display */
  text: string
  /** Maximum characters to show when collapsed (default: 150) */
  maxChars?: number
  /** Custom text for the "Read more" button */
  moreLabel?: string
  /** Custom text for the "Read less" button */
  lessLabel?: string
  /** Additional className for the container */
  className?: string
  /** Additional className for the button */
  buttonClassName?: string
  /** Use custom icons instead of arrows */
  customIcons?: {
    more: ReactNode
    less: ReactNode
  }
  /** Whether to initially show the full text */
  initiallyExpanded?: boolean
}

/**
 * A reusable component for expandable/collapsible text content
 *
 * @example
 * <ReadMore
 *   text="Lorem ipsum dolor sit ..."
 *   maxChars={100}
 * />
 */
export const ReadMore: FC<ReadMoreProps> = ({
  text,
  maxChars = 150,
  moreLabel = "Read more",
  lessLabel = "Read less",
  className,
  buttonClassName,
  customIcons,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)

  // Don't truncate if the text is shorter than maxChars
  const needsTruncation = text.length > maxChars

  // If no truncation is needed, just render the text
  if (!needsTruncation) {
    return (
      <div className={className}>
        <p>{text}</p>
      </div>
    )
  }

  const toggleReadMore = () => setIsExpanded(!isExpanded)

  const shortText = `${text.substring(0, maxChars)}...`
  const displayText = isExpanded ? text : shortText

  const moreIcon = customIcons?.more || <ChevronDown className="size-4" />
  const lessIcon = customIcons?.less || <ChevronUp className="size-4" />

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm leading-relaxed tracking-wide md:text-base">
        {displayText}
      </p>

      <button
        onClick={toggleReadMore}
        className={cn(
          "text-primary mt-2 flex cursor-pointer items-center text-sm font-medium hover:underline",
          buttonClassName,
        )}
        aria-expanded={isExpanded}
        aria-controls="expanded-text"
      >
        {isExpanded ? lessLabel : moreLabel}
        <span className="ml-1">{isExpanded ? lessIcon : moreIcon}</span>
      </button>
    </div>
  )
}
