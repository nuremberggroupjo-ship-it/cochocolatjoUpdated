"use client"

import { FC, useState } from "react"

import { Check, ChevronsUpDown, X } from "lucide-react"
import { ControllerRenderProps } from "react-hook-form"

import { Attribute } from "@/lib/_generated/prisma"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { SaveProductSchema } from "@/features/admin/features/products/lib/product.schema"

interface AttributeSelectorProps
  extends ControllerRenderProps<SaveProductSchema, "attributes"> {
  attributes: Attribute[]
  disabled?: boolean
}

export const AttributeSelector: FC<AttributeSelectorProps> = ({
  attributes,
  value: selectedIds,
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false)

  // Toggle attribute selection
  const toggleAttribute = (attributeId: string) => {
    const currentSelection = selectedIds || []

    if (currentSelection.includes(attributeId)) {
      // Remove if already selected - create new array
      const newSelection = currentSelection.filter((id) => id !== attributeId)
      onChange?.(newSelection)
    } else {
      // Add if not selected - create new array
      const newSelection = [...currentSelection, attributeId]
      onChange?.(newSelection)
    }
  }

  // Remove a single attribute
  const removeAttribute = (attributeId: string) => {
    const filtered = selectedIds?.filter((attr) => attr !== attributeId)

    onChange?.(filtered || [])
  }

  // Get selected attribute objects for display
  const selectedAttributeObjects = attributes.filter((attr) =>
    selectedIds?.includes(attr.id),
  )

  return (
    <div className="flex flex-col space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between",
              selectedIds && selectedIds?.length > 0
                ? "text-foreground"
                : "text-muted-foreground",
            )}
            disabled={disabled}
          >
            {selectedIds && selectedIds.length > 0
              ? `${selectedIds.length} attributes selected`
              : "Select attributes"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search attributes..." />
            <CommandEmpty>No attribute found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {attributes.map((attribute) => (
                <CommandItem
                  key={attribute.id}
                  value={attribute.name}
                  onSelect={() => toggleAttribute(attribute.id)}
                >
                  <span>{attribute.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedIds?.includes(attribute.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected attributes as badges */}
      {selectedAttributeObjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAttributeObjects.map((attr) => (
            <Badge key={attr.id} variant="secondary" className="px-2 py-1">
              <div className="flex items-center gap-1">
                <span>{attr.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => removeAttribute(attr.id)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
