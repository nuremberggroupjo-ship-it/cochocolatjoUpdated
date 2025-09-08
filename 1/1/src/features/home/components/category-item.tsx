// src/features/home/components/category-item.tsx
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

import { Category } from "@/lib/_generated/prisma"
import { cn } from "@/lib/utils"

export const CategoryItem: FC<Category> = ({ name, thumbnailImage, slug }) => {
  return (
    <li
      className={cn(
        "group/category-card relative flex h-48 w-[calc(50%-1rem)] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl shadow md:w-[calc(33.33%-1.5rem)] lg:w-[calc(25%-2rem)]",
        "z-0",
      )}
    >
      <Link
        href={`/categories/${slug}`}
        className="flex h-full w-full flex-col items-center justify-center"
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={thumbnailImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="bg-accent object-cover transition-transform duration-300 group-hover/category-card:scale-110"
          />
        </div>

        {/*  name */}
        <div className="bg-background relative z-10 mt-auto w-full py-2 text-center">
          <span className="group-hover/category-card:text-primary text-sm font-semibold capitalize transition-all duration-200 md:text-base lg:text-lg">
            {name}
          </span>
        </div>
      </Link>
    </li>
  )
}
