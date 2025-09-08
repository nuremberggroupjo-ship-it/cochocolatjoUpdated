"use client"

import { FC } from "react"

import type { ProductsSort } from "@/types"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { SORT_OPTIONS } from "@/features/shop-now/constants"

interface SortByFilterProps {
  sort: ProductsSort | undefined
  updateSort: (value: ProductsSort) => void
}

export const SortByFilter: FC<SortByFilterProps> = ({ updateSort, sort }) => {
  return (
    <div className="flex justify-center lg:justify-end">
      <Select value={sort} onValueChange={updateSort}>
        <SelectTrigger className="w-[160px] md:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {SORT_OPTIONS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
