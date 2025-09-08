"use client"

import * as React from "react"

import type { Table } from "@tanstack/react-table"
import { Check, ChevronsUpDown, Settings2 } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  /**
   * Custom label for the "View" button.
   * @default "View"
   */
  buttonLabel?: string
  /**
   * Custom placeholder for the search input.
   * @default "Search columns..."
   */
  searchPlaceholder?: string
  /**
   * Custom message when no columns are found.
   * @default "No columns found."
   */
  emptyMessage?: string
}

/**
 * A component to toggle the visibility of columns in a data table.
 *
 * @param {DataTableViewOptionsProps<TData>} props - Configuration options for the component.
 * @returns A button and popover to toggle column visibility.
 */
export function DataTableViewOptions<TData>({
  table,
  buttonLabel = "View",
  searchPlaceholder = "Search columns...",
  emptyMessage = "No columns found.",
}: DataTableViewOptionsProps<TData>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  // Memoize the list of toggle able columns to avoid unnecessary recalculations
  const toggleAbleColumns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== "undefined" && column.getCanHide(),
        ),
    [table],
  )

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          aria-label="Toggle columns"
          variant="outline"
          role="combobox"
          size="sm"
          className="focus:ring-ring ml-auto h-8 gap-2 focus:ring-1 focus:outline-none focus-visible:ring-0"
        >
          <Settings2 className="size-4" />
          <span className="hidden md:flex">{buttonLabel}</span>
          <ChevronsUpDown className="ml-auto hidden size-4 shrink-0 opacity-50 md:flex" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-44 p-0"
        onCloseAutoFocus={() => triggerRef.current?.focus()}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {toggleAbleColumns.map((column) => (
                <CommandItem
                  key={column.id}
                  onSelect={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  <span className="truncate capitalize">{column.id}</span>
                  <Check
                    className={cn(
                      "ml-auto size-4 shrink-0",
                      column.getIsVisible() ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
