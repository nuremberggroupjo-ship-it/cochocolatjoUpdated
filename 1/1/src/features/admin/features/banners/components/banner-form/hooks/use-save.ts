"use client"

import { useRouter } from "next/navigation"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { saveBannerAction } from "@/features/admin/features/banners/actions/save-banner.action"

export function useSave(slug: string) {
  const router = useRouter()

  const boundOnSaveBannerAction = saveBannerAction.bind(null, slug)

  const {
    execute: saveExecute,
    isPending: isSavePending,
    result: saveResult,
  } = useAction(boundOnSaveBannerAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      router.replace(ADMIN_TABLE.banners.routes.default)
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
