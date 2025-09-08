import Image from "next/image"
import { notFound } from "next/navigation"
import { FC } from "react"
import { getCategoryBySlugPublic } from "@/data"

interface CategoryLayoutWrapperProps {
  children: React.ReactNode
  params: { slug: string } | Promise<{ slug: string }>
}

// Type guard to check if object is a Promise
function isPromise<T>(obj: T | Promise<T>): obj is Promise<T> {
  return !!obj && typeof (obj as Promise<T>).then === "function"
}

export const CategoryLayoutWrapper: FC<CategoryLayoutWrapperProps> = async ({
  children,
  params,
}) => {
  const resolvedParams = isPromise(params) ? await params : params
  const { slug } = resolvedParams

  const category = await getCategoryBySlugPublic(slug)
  if (!category) return notFound()

  return (
    <section className="mt-4">
      <div className="space-y-4">
        {category.coverImage && (
          <Image
            src={category.coverImage}
            alt={category.name}
            width={1250}
            height={400}
            className="aspect-[16/5.5] w-full rounded"
          />
        )}
        <h1 className="font-bold tracking-wider sm:text-base md:text-xl lg:text-2xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-muted-foreground text-sm md:text-base">
            {category.description}
          </p>
        )}
      </div>

      {children}
    </section>
  )
}
