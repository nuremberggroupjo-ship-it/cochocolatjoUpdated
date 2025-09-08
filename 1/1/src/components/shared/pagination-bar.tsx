"use client"

import { useSearchParams } from "next/navigation"
import { FC } from "react"

import { cn } from "@/lib/utils"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationBarProps {
  currentPage: number
  totalPages: number
}

export const PaginationBar: FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
}) => {
  const searchParams = useSearchParams()

  const getLink = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("page", page.toString())

    return `?${newSearchParams.toString()}`
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={getLink(currentPage - 1)}
            className={cn(
              currentPage === 1 && "text-muted-foreground pointer-events-none",
            )}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1
          // (first or last page)
          const isEdgePage = page === 1 || page === totalPages
          const isNearCurrentPage = Math.abs(page - currentPage) <= 2

          if (!isEdgePage && !isNearCurrentPage) {
            if (index === 1 || index === totalPages - 2) {
              return (
                <PaginationItem key={page} className="hidden md:block">
                  <PaginationEllipsis className="text-muted-foreground" />
                </PaginationItem>
              )
            }
            return null
          }
          return (
            <PaginationItem
              key={page}
              className={cn(
                "hidden md:block",
                page === currentPage && "pointer-events-none block",
              )}
            >
              <PaginationLink
                href={getLink(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}
        {/* Next  */}
        <PaginationItem>
          <PaginationNext
            href={getLink(currentPage + 1)}
            className={cn(
              currentPage >= totalPages &&
                "text-muted-foreground pointer-events-none",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
