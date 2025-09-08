"use client"

import { useRouter } from "next/navigation"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { deleteCategoryAction } from "@/features/admin/features/categories/actions/delete-category.action"

export function useDelete() {
  const router = useRouter()

  const {
    execute: deleteExecute,
    isPending: isDeletePending,
    result: deleteResult,
  } = useAction(deleteCategoryAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      router.replace(ADMIN_TABLE.categories.routes.default)
    },
    onError(args) {
      toast.error("Deletion failed")
      console.log(args.error)
    },
  })

  return {
    deleteExecute,
    isDeletePending,
    deleteResult,
  }
}
