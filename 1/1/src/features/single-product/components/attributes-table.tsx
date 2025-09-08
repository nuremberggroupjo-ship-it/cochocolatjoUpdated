import Image from "next/image"
import { FC } from "react"

import { ProductData } from "@/types/db"

import { cn } from "@/lib/utils"

interface AttributesTableProps {
  attributes: ProductData["attributes"]
  className?: string
}

export const AttributesTable: FC<AttributesTableProps> = ({
  attributes,
  className,
}) => {
  if (!attributes?.length) {
    return null
  }

  return (
    <section className={cn("space-y-4", className)}>
      <h3 className="text-xl font-semibold tracking-wider">Suitable for</h3>

      <div className="bg-background border-border/50 w-full overflow-hidden rounded-lg border">
        <ul className="divide-border/50 divide-y" role="list">
          {attributes.map(({ attribute }, index) => (
            <li
              key={attribute.id}
              className={cn(
                "grid min-h-[70px] grid-cols-[auto_1fr] items-center gap-3 p-3",
                index % 2 === 0 ? "bg-background" : "bg-muted/30",
              )}
            >
              {/* Image Column - Smaller size */}
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center">
                <div className="relative h-12 w-12">
                  <Image
                    src={attribute.image}
                    alt={`${attribute.name} attribute icon`}
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
              </div>

              {/* Content Column - Tighter spacing */}
              <div className="min-w-0 space-y-1">
                <h4 className="text-foreground text-base leading-tight font-semibold">
                  {attribute.name}
                </h4>
                {attribute.description && (
                  <p className="text-muted-foreground text-sm leading-snug break-words">
                    {attribute.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
