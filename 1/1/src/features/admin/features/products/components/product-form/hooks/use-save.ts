"use client"

import { useRouter } from "next/navigation"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { saveProductAction } from "@/features/admin/features/products/actions/save-product.action"

export function useSave(slug: string) {
  const router = useRouter()

  const boundOnSaveProductAction = saveProductAction.bind(null, slug)

  const {
    execute: saveExecute,
    isPending: isSavePending,
    result: saveResult,
  } = useAction(boundOnSaveProductAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      router.replace(ADMIN_TABLE.products.routes.default)
    },
    onError(args) {
      toast.error(args.error.serverError)
    },
  })

  return {
    saveExecute,
    isSavePending,
    saveResult,
  }
}
