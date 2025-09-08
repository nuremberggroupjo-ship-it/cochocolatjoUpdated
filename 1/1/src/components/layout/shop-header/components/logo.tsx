import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

import LogoImage from "@/assets/images/logo.png"

export const Logo: FC = () => {
  return (
    <div className="hidden justify-center lg:flex">
      <Link href="/" aria-label="Home" className="inline-block">
        <Image
          src={LogoImage}
          alt="Logo"
          width={400}
          height={400}
          className="w-[350px]"
          priority
        />
      </Link>
    </div>
  )
}
