import Image from "next/image"
import { FC } from "react"

import { ProductData } from "@/types/db"

import { AppTooltip } from "@/components/shared/app-tooltip"

const MAX_ATTRIBUTES = 4

interface AttributeListProps {
  attributes: ProductData["attributes"]
}

export const AttributeList: FC<AttributeListProps> = ({ attributes }) => {
  // Take only the first 5 attributes
  const displayAttributes = attributes.slice(0, MAX_ATTRIBUTES)
  return (
    <ul className="flex flex-wrap items-center justify-center gap-2 p-2">
      {displayAttributes.map(({ attribute }) => (
        <AppTooltip
          side="bottom"
          key={attribute.id}
          className="text-sm"
          trigger={
            <li className="relative size-8 overflow-hidden rounded-full sm:size-6 md:size-8">
              <Image
                src={attribute.image}
                alt={attribute.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </li>
          }
        >
          {attribute.name}
        </AppTooltip>
      ))}
    </ul>
  )
}
