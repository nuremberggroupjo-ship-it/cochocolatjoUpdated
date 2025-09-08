"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, FC, Fragment, useMemo } from "react"

import { cn } from "@/lib/utils"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface AppBreadcrumbProps extends ComponentProps<typeof Breadcrumb> {
  basePath?: string
  baseLabel?: string
  homeLabel?: string
  homePath?: string
  listClassName?: string
}

const FRONTEND_PATH_LABEL_MAP: Record<
  string,
  { label: string; href?: string }
> = {
  products: { label: "Shop Now", href: "/shop-now" },
  categories: { label: "Categories" },
  // Add more frontend mappings as needed
}

const ADMIN_PATH_LABEL_MAP: Record<string, { label: string; href?: string }> = {
  products: { label: "Products" },
  categories: { label: "Categories" },
  orders: { label: "Orders" },
  users: { label: "Users" },
  // Add more admin mappings as needed
}

export const AppBreadcrumb: FC<AppBreadcrumbProps> = ({
  basePath = "/dashboard",
  baseLabel = "dashboard",
  homeLabel = "Home",
  homePath = "/",
  listClassName,
  ...props
}) => {
  const pathname: string = usePathname()

  // Check if we're in the admin section
  const isAdminSection = pathname.startsWith(basePath)

  // Memoize the pathList to avoid recalculating it on each render
  const pathList = useMemo(() => {
    // For admin paths, remove the /dashboard prefix before splitting
    if (isAdminSection) {
      const adminPath = pathname.substring(basePath.length)
      return adminPath.split("/").filter(Boolean)
    }

    // For non-admin paths, keep the standard behavior
    return pathname.split("/").filter(Boolean)
  }, [pathname, basePath, isAdminSection])

  const isAtBasePath = pathname === basePath || pathname === `${basePath}/`
  const isAtHomePath = pathname === homePath || pathname === "/"

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList
        className={cn("text-xs md:text-sm lg:text-base", listClassName)}
      >
        {/* Admin section: Show Dashboard */}
        {isAdminSection ? (
          <BreadcrumbItem>
            {isAtBasePath ? (
              <BreadcrumbPage className="block max-w-36 truncate capitalize md:max-w-60 lg:max-w-96">
                {baseLabel}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link
                  href={basePath}
                  className="block max-w-36 truncate capitalize md:max-w-60 lg:max-w-96"
                >
                  {baseLabel}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ) : (
          /* Frontend section: Show Home */
          <BreadcrumbItem>
            {isAtHomePath ? (
              <BreadcrumbPage className="block max-w-36 truncate capitalize md:max-w-60 lg:max-w-96">
                {homeLabel}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link
                  href={homePath}
                  className="block max-w-36 truncate capitalize md:max-w-60 lg:max-w-96"
                >
                  {homeLabel}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        )}

        {/* Show separator after first item if there are path segments */}
        {pathList.length > 0 && <BreadcrumbSeparator />}

        {/* Display path segments as breadcrumbs */}
        {pathList.map((path, index) => {
          const segments = pathList.slice(0, index + 1)

          // Use different mappings based on whether we're in admin or frontend
          const pathLabelMap = isAdminSection
            ? ADMIN_PATH_LABEL_MAP
            : FRONTEND_PATH_LABEL_MAP
          const mapped = pathLabelMap[path]

          const href = mapped?.href
            ? mapped.href
            : isAdminSection
              ? `${basePath}/${segments.join("/")}`
              : `/${segments.join("/")}`
          // Construct the href based on whether we're in admin section or not

          const label = mapped?.label
            ? mapped.label
            : path
                .split("-")
                .join(" ")
                .replace(/\b\w/g, (char) => char.toUpperCase())
          // Format path: replace hyphens with spaces and capitalize each word
          const isLastPath = index === pathList.length - 1

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLastPath ? (
                  <BreadcrumbPage className="block max-w-36 truncate capitalize md:max-w-60 lg:max-w-96">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      className="block max-w-36 truncate capitalize md:max-w-60 lg:max-w-96"
                    >
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastPath && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
