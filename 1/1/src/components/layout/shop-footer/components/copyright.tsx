import Link from "next/link"
import { FC } from "react"

import { NUREMBERG_GROUP_HREF } from "@/constants"

export const Copyright: FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="mt-4 border-t pt-4 text-center md:mt-6 md:pt-6 lg:mt-10 lg:pt-8">
      <p className="text-muted-foreground text-sm">
        © {currentYear} Co Chocolat. All rights reserved. Made By&nbsp;
        <Link href={NUREMBERG_GROUP_HREF} className="text-primary">
          Nuremberg Group.
        </Link>
      </p>
    </div>
  )
}
