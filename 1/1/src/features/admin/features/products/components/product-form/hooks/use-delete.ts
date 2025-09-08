"use client"

import { useRouter } from "next/navigation"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { deleteProductAction } from "@/features/admin/features/products/actions/delete-product.action"

export function useDelete() {
  const router = useRouter()

  const {
    execute: deleteExecute,
    isPending: isDeletePending,
    result: deleteResult,
  } = useAction(deleteProductAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      router.replace(ADMIN_TABLE.products.routes.default)
    },
    onError(args) {
      console.log(args.error)
      toast.error(args.error.serverError || "Deletion failed")
    },
  })

  return {
    deleteExecute,
    isDeletePending,
    deleteResult,
  }
}
