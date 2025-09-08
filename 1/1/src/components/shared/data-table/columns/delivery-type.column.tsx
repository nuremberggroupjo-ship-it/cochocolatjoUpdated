"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DeliveryType } from "@/lib/_generated/prisma"
import { SHARED_ORDER_UTILS } from "@/lib/shared/order-utils"

import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/shared/data-table/components/data-table-column-header"

interface DeliveryTypeColumnOptions {
  deliveryType: DeliveryType
}

/**
 * Shared delivery type column component
 * Can be used by both admin and customer tables
 */
export function deliveryTypeColumn<T extends DeliveryTypeColumnOptions>(
  options: {
    title?: string
    size?: number
  } = {},
): ColumnDef<T> {
  const { title = "Delivery Type", size = 120 } = options

  return {
    accessorKey: "deliveryType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const deliveryType = row.getValue("deliveryType") as DeliveryType
      const deliveryOption =
        SHARED_ORDER_UTILS.getDeliveryTypeOption(deliveryType)

      if (!deliveryOption) {
        return <span className="text-muted-foreground">Unknown</span>
      }

      return (
        <Badge
          variant="secondary"
          className={`${deliveryOption.color} font-medium`}
        >
          {deliveryOption.shortLabel}
        </Badge>
      )
    },
    size,
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  }
}
