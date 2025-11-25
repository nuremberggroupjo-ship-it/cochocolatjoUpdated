import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

//import SquareLogoImage from "@/assets/images/square-logo.png"
import Logo from "@/assets/images/logo.png"


export const MobileLogo: FC = () => {
  return (
    <Link href="/" aria-label="Home" className="block lg:hidden">
      <Image
        src={Logo}
        alt="Logo"
        width={200}
        height={200}
        className="w-20"
        priority
        unoptimized
      />
    </Link>
  )
}