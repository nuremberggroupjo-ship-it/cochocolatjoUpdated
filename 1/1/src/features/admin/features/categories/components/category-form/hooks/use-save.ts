"use client"

import { useRouter } from "next/navigation"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { saveCategoryAction } from "@/features/admin/features/categories/actions/save-category.action"

export function useSave(slug: string) {
  const router = useRouter()

  const boundOnSaveCategoryAction = saveCategoryAction.bind(null, slug)

  const {
    execute: saveExecute,
    isPending: isSavePending,
    result: saveResult,
  } = useAction(boundOnSaveCategoryAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      router.replace(ADMIN_TABLE.categories.routes.default)
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
