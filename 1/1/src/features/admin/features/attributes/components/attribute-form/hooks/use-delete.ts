"use client"

import { useRouter } from "next/navigation"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { deleteAttributeAction } from "@/features/admin/features/attributes/actions/delete-attribute.action"

export function useDelete() {
  const router = useRouter()

  const {
    execute: deleteExecute,
    isPending: isDeletePending,
    result: deleteResult,
  } = useAction(deleteAttributeAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      router.replace(ADMIN_TABLE.attributes.routes.default)
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
