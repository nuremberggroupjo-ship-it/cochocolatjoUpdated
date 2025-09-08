import Link from "next/link"

import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface AddItemButtonProps {
  href: string
}

export function AddItemButton({ href }: AddItemButtonProps) {
  return (
    <Button asChild>
      <Link href={href} className="flex w-10 justify-center sm:w-auto">
        <PlusIcon className="size-4" />
        <span className="hidden text-sm capitalize sm:block md:text-base">
          add
        </span>
      </Link>
    </Button>
  )
}
