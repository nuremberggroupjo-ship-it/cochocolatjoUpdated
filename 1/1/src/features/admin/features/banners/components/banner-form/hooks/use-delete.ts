"use client"

import { useRouter } from "next/navigation"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { deleteBannerAction } from "@/features/admin/features/banners/actions/delete-banner.action"

export function useDelete() {
  const router = useRouter()

  const {
    execute: deleteExecute,
    isPending: isDeletePending,
    result: deleteResult,
  } = useAction(deleteBannerAction, {
    onSuccess(args) {
      toast.success(args.data?.message)
      router.replace(ADMIN_TABLE.banners.routes.default)
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
