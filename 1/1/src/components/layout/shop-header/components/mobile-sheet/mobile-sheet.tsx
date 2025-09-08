"use client"

import { useRouter } from "next/navigation"
import { FC, useState } from "react"

import { AlignLeftIcon } from "lucide-react"

import HeartSvg from "@/assets/svg/heart.svg"
import WhatsappSvg from "@/assets/svg/whatsapp.svg"

import { cn } from "@/lib/utils"

import { FOOTER_ADDRESS, SHOP_MAIN_NAV_LIST, SOCIAL_LINKS } from "@/constants"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { AppSheet } from "@/components/shared/app-sheet"
import { SvgIcon } from "@/components/shared/svg-icon"

import { MobileUserAuth } from "./components"

export const MobileSheet: FC = () => {
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)

  const handleOpenSheet = () => {
    setIsSheetOpen(true)
  }
  const handleCloseSheet = () => {
    setIsSheetOpen(false)
  }

  return (
    <AppSheet
      trigger={
        <Button
          size="icon"
          variant="ghost"
          onClick={handleOpenSheet}
          className="text-muted-foreground size-auto !px-0 hover:bg-transparent lg:hidden"
        >
          <AlignLeftIcon className="size-5 stroke-[1.5]" />
        </Button>
      }
      title="Shop"
      description="Finally, a chocolate that is good for you."
      side="left"
      open={isSheetOpen}
      onOpenChange={setIsSheetOpen}
    >
      {/* Navigation Links */}
      <nav>
        <ul className="flex grow flex-col">
          {SHOP_MAIN_NAV_LIST.map((item, index) => (
            <li
              key={item.id}
              className="relative flex items-center justify-start"
            >
              <span
                onClick={() => {
                  handleCloseSheet()
                  router.push(item.href)
                }}
                className={cn(
                  "border-border/50 relative w-full border-b p-4",
                  index === 0 && "border-t",
                  item.comingSoon &&
                    "text-muted-foreground pointer-events-none",
                )}
              >
                {item.label}
              </span>
              {item.comingSoon && (
                <Badge
                  variant="gradientDestructive"
                  className="absolute right-2 text-[0.65rem] tracking-wide"
                >
                  Coming Soon
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <ul className="flex flex-col gap-6 p-4">
        <li
          onClick={() => {
            handleCloseSheet()
            router.push("/favorites")
          }}
          className="inline-flex items-center gap-2"
        >
          <SvgIcon icon={HeartSvg} className="text-primary size-5" />
          <span className="text-primary">Favorites</span>
        </li>

        <li
          className="inline-flex items-center gap-2"
          onClick={() => {
            handleCloseSheet()
            window.open(
              SOCIAL_LINKS.find((link) => link.id === "whatsapp")?.href,
              "_blank",
            )
          }}
        >
          <SvgIcon
            icon={WhatsappSvg}
            className="fill-primary size-5 stroke-2"
          />
          <span className="text-primary">{FOOTER_ADDRESS.phoneNumber}</span>
        </li>

        <MobileUserAuth handleCloseSheet={handleCloseSheet} />
      </ul>
    </AppSheet>
  )
}
