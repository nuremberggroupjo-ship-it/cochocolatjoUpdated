"use client"

import { useRouter } from "next/navigation"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { saveAttributeAction } from "@/features/admin/features/attributes/actions/save-attribute.action"

export function useSave(slug: string) {
  const router = useRouter()

  const boundOnSaveAttributeAction = saveAttributeAction.bind(null, slug)

  const {
    execute: saveExecute,
    isPending: isSavePending,
    result: saveResult,
  } = useAction(boundOnSaveAttributeAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      router.replace(ADMIN_TABLE.attributes.routes.default)
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
