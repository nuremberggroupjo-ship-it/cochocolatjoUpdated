"use client"

import { type Row } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { DeleteSafeAction } from "@/types"

import { DIALOG_TEXTS } from "@/constants"

import { Button } from "@/components/ui/button"
import { type ResponsiveModal } from "@/components/ui/responsive-modal"

import { AppResponsiveModal } from "@/components/shared/app-responsive-modal"

import type { TableName } from "@/features/admin/types"

interface DataTableDeleteAction<T>
  extends React.ComponentProps<typeof ResponsiveModal> {
  showTrigger?: boolean
  selectedRows: Row<T>["original"][]
  tableName: TableName
  deleteAction: DeleteSafeAction
  deleteActionSuccessRoute?: string
  onDeleteActionSuccess?: () => void
}

export function DataTableDeleteAction<T>({
  selectedRows,
  deleteAction,
  onDeleteActionSuccess,
  showTrigger = true,
  ...props
}: DataTableDeleteAction<T>) {
  const ids = selectedRows.map((row) => (row as { id: string }).id)
  const names = selectedRows
    .map((row) => (row as { name: string }).name)
    .join(", ")

  const { execute, isPending } = useAction(deleteAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      onDeleteActionSuccess?.()
      props.onOpenChange?.(false)
    },
    onError(args) {
      toast.error(args.error.serverError || "Deletion failed")
      props.onOpenChange?.(false)
    },
  })

  const description = DIALOG_TEXTS.DELETE_CONFIRMATION.DESCRIPTION(names)

  return (
    <AppResponsiveModal
      showTrigger={showTrigger}
      trigger={
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-0 size-4 md:mr-1" aria-hidden="true" />
          <span className="hidden md:flex">Delete</span> ({selectedRows.length})
        </Button>
      }
      isDescriptionHtml
      description={description}
      onAction={() => execute({ id: ids.length > 1 ? ids : ids[0] })}
      isActionLoading={isPending}
      {...props}
    />
  )
}
