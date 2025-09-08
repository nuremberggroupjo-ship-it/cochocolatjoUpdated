import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC } from "react"

import { User2Icon } from "lucide-react"

import { AppTooltip } from "@/components/shared/app-tooltip"

export const SigninLinkIcon: FC = () => {
  const pathname = usePathname()
  const callbackURL = encodeURIComponent(pathname)

  return (
    <AppTooltip
      trigger={
        <Link
          href={`/login?callbackURL=${callbackURL}`}
          className="hover:text-primary text-muted-foreground hidden transition-colors duration-200 lg:block"
        >
          <User2Icon className="size-5 stroke-[1.5]" />
        </Link>
      }
    >
      <p>Sign in</p>
    </AppTooltip>
  )
}
