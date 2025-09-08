"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC, ReactNode, useEffect, useRef, useState } from "react"

import LogoImage from "@/assets/images/logo.png"

import { cn } from "@/lib/utils"

import { SHOP_MAIN_NAV_LIST } from "@/constants"

import { Badge } from "@/components/ui/badge"

interface NavbarProps {
  children: ReactNode
}

export const Navbar: FC<NavbarProps> = ({ children }) => {
  const [isSticky, setIsSticky] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const stickyTriggerRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()

  useEffect(() => {
    const nav = navRef.current
    const stickyTrigger = stickyTriggerRef.current

    if (!nav || !stickyTrigger) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the trigger element is not intersecting (out of view),
        // the navbar is sticky at the top
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(stickyTrigger)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* This invisible element serves as a trigger point */}
      <div ref={stickyTriggerRef} className="h-[1px] w-full" />
      <nav
        ref={navRef}
        className={cn(
          "border-border/50 bg-background sticky top-0 z-50 hidden w-full border-b py-4 pb-5 lg:block",
          isSticky && "border-b-0 shadow-sm",
        )}
      >
        {isSticky && (
          <Link
            href="/"
            className="absolute top-0 left-2 flex h-full items-center pr-6"
          >
            <Image
              src={LogoImage}
              alt="Logo"
              width={300}
              height={100}
              className="w-[180px]"
              priority
            />
          </Link>
        )}
        <ul className="flex justify-center gap-12">
          {SHOP_MAIN_NAV_LIST.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  "relative pb-1 font-bold",
                  "after:bg-primary/60 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 hover:after:w-full",
                  pathname === item.href ? "after:w-1/2" : "after:w-0",
                  item.comingSoon &&
                    "text-muted-foreground pointer-events-none",
                )}
              >
                {item.label}
                {item.comingSoon && (
                  <Badge
                    variant="gradientDestructive"
                    className="absolute -top-4.5 -right-4 text-[0.6rem]"
                  >
                    Soon
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
        {isSticky && (
          <div className="absolute top-0 right-2 flex h-full items-center pl-6">
            {children}
          </div>
        )}
      </nav>
    </>
  )
}
