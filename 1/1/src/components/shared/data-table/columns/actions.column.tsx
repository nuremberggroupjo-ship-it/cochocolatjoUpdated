"use client"

import { useRouter } from "next/navigation"
import { type Dispatch, type SetStateAction } from "react"

import { ColumnDef } from "@tanstack/react-table"
import { EditIcon, EllipsisIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"
import { DataTableRowAction } from "@/components/shared/data-table/types"

interface SlugType {
  slug: string
}

interface IdType {
  id: string
}

type ActionsColumnProps<T extends SlugType | IdType> = {
  setRowAction?: Dispatch<SetStateAction<DataTableRowAction<T> | null>>
  editRoute: string
  hasDelete?: boolean
}


export const actionsColumn = <T extends SlugType | IdType>({
  setRowAction,
  editRoute,
  hasDelete = true,
}: ActionsColumnProps<T>): ColumnDef<T> => ({
  id: "actions",
  cell: function Cell({ row }) {
    const router = useRouter()
    const identifier =
      "slug" in row.original ? row.original.slug : row.original.id
    const hrefToPush = `${editRoute}/${identifier}`
    return (
      <>
        <div className="hidden items-center gap-1 md:flex">
          {/* Edit */}
          <ButtonWithTooltip
            tooltipContent="Edit"
            aria-label="Edit"
            className="text-info/80 hover:bg-info/10 hover:text-info size-8"
            tooltipClassName="bg-info"
            tooltipArrowClassName="bg-info fill-info"
            onClick={() => router.push(hrefToPush)}
          >
            <EditIcon className="size-4" />
            <span className="sr-only">Edit {identifier}</span>
          </ButtonWithTooltip>
          {/* Delete */}
          {hasDelete && setRowAction && (
            <ButtonWithTooltip
              tooltipContent="Delete"
              aria-label="Delete"
              className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive size-8"
              tooltipClassName="bg-destructive"
              tooltipArrowClassName="bg-destructive fill-destructive"
              onClick={() => setRowAction({ row, type: "delete" })}
            >
              <Trash2Icon className="size-4" />
              <span className="sr-only">Delete {identifier}</span>
            </ButtonWithTooltip>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="data-[state=open]:bg-muted flex size-8 p-0 md:hidden"
            >
              <EllipsisIcon className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-20 md:w-40">
            <DropdownMenuItem
              onSelect={() => {
                router.push(hrefToPush)
              }}
            >
              Edit
              <span className="sr-only">Edit {identifier}</span>
              <DropdownMenuShortcut className="hidden md:flex">
                <EditIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            {hasDelete && setRowAction && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setRowAction({ row, type: "delete" })}
                >
                  Delete
                  <span className="sr-only">Delete {identifier}</span>
                  <DropdownMenuShortcut className="hidden md:flex">
                    <Trash2Icon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>{" "}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  },
  size: 40,
})
