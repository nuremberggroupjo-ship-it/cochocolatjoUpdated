"use client"

import { FC } from "react"

import { cn } from "@/lib/utils"

import "../styles/editor.css"

interface RichTextDisplayProps {
  content: string
  className?: string
}

export const RichTextDisplay: FC<RichTextDisplayProps> = ({
  content,
  className,
}) => {
  if (!content) return null

  return (
    <section className={cn("space-y-4", className)}>
      <h3 className="text-xl font-semibold tracking-wider">Descriptions</h3>
      <div
        className={cn("tiptap rich-text-display", className)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  )
}
