import { AppBreadcrumb } from "@/components/shared/app-breadcrumb"
//import {FiltersLayout} from "../../../features/shop-now/components/filter-layout/filters-layout"
// src/features/shop-now/components/filter-layout/componets/filter-;ayout

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="container flex-1 py-4 lg:max-w-[90%]">
      <AppBreadcrumb />
     
      {children}
    </main>
  )
}
