import {
  LayoutDashboardIcon,
  ListCheckIcon,
  ShoppingCartIcon,
  TablePropertiesIcon,
  TagIcon,
  TicketXIcon,
  UsersIcon,
} from "lucide-react"

import { SidebarNavItem } from "@/features/admin/types"

const createRoutes = (basePath: string) => ({
  default: basePath,
  new: `${basePath}/new`,
})

export const ADMIN_TABLE = {
  categories: {
    heading: {
      title: "categories",
      description: "A list of all categories",
    },

    skeleton: {
      columnsCount: 7,
      cellWidths: ["2rem", "4rem", "6rem", "6rem", "6rem", "4rem", "2rem"],
    },
    routes: createRoutes("/dashboard/categories"),
  },
  banners: {
    heading: {
      title: "banners",
      description: "A list of all banners",
    },

    skeleton: {
      columnsCount: 7,
      cellWidths: ["2rem", "4rem", "6rem", "6rem", "6rem", "4rem", "2rem"],
    },
    routes: createRoutes("/dashboard/banners"),
  },
  attributes: {
    heading: {
      title: "attributes",
      description: "A list of all attributes",
    },

    skeleton: {
      columnsCount: 7,
      cellWidths: ["2rem", "4rem", "6rem", "6rem", "6rem", "4rem", "2rem"],
    },
    routes: createRoutes("/dashboard/attributes"),
  },
  products: {
    heading: {
      title: "products",
      description: "A list of all products",
    },

    skeleton: {
      columnsCount: 7,
      cellWidths: ["2rem", "4rem", "6rem", "6rem", "6rem", "4rem", "2rem"],
    },
    routes: createRoutes("/dashboard/products"),
  },
  users: {
    heading: {
      title: "users",
      description: "A list of all users and their roles",
    },

    skeleton: {
      columnsCount: 6,
      cellWidths: ["2rem", "4rem", "8rem", "10rem", "6rem", "2rem"],
    },
    routes: createRoutes("/dashboard/users"),
  },
  orders: {
    heading: {
      title: "orders",
      description: "A list of all orders and their status",
    },

    skeleton: {
      columnsCount: 8,
      cellWidths: [
        "2rem",
        "6rem",
        "4rem",
        "4rem",
        "6rem",
        "4rem",
        "4rem",
        "2rem",
      ],
    },
    routes: createRoutes("/dashboard/orders"),
  },
}

// Admin Main navigation items
export const SIDEBAR_NAV_LIST: SidebarNavItem[] = [
  {
    title: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "banners",
    href: "/dashboard/banners",

    icon: TicketXIcon,
    subItems: [
      {
        title: "Table",
        href: ADMIN_TABLE.banners.routes.default,
      },
      {
        title: "Add",
        href: ADMIN_TABLE.banners.routes.new,
      },
    ],
  },
  {
    title: "categories",
    href: "/dashboard/categories",

    icon: TagIcon,
    subItems: [
      {
        title: "Table",
        href: ADMIN_TABLE.categories.routes.default,
      },
      {
        title: "Add",
        href: ADMIN_TABLE.categories.routes.new,
      },
    ],
  },

  {
    title: "attributes",
    href: "/dashboard/attributes",
    icon: TablePropertiesIcon,
    subItems: [
      {
        title: "Table",
        href: ADMIN_TABLE.attributes.routes.default,
      },
      {
        title: "Add",
        href: ADMIN_TABLE.attributes.routes.new,
      },
    ],
  },
  {
    title: "products",
    href: "/dashboard/products",
    icon: ListCheckIcon,
    subItems: [
      {
        title: "Table",
        href: ADMIN_TABLE.products.routes.default,
      },
      {
        title: "Add",
        href: ADMIN_TABLE.products.routes.new,
      },
    ],
  },
  {
    title: "users",
    href: "/dashboard/users",
    icon: UsersIcon,
    subItems: [
      {
        title: "Table",
        href: ADMIN_TABLE.users.routes.default,
      },
    ],
  },
  {
    title: "orders",
    href: "/dashboard/orders",
    icon: ShoppingCartIcon,
    subItems: [
      {
        title: "Table",
        href: ADMIN_TABLE.orders.routes.default,
      },
    ],
  },
]

export const ADMIN_FORM = {
  DESCRIPTIONS: {
    SLUG: "This will be auto-generated from the entered name",
    SHORT_DESCRIPTION:
      "A brief description of the item, typically shown in lists or previews.",
    COVER_IMAGE:
      "This image is displayed at the top of the detail page, providing a visual context for the item.",
    THUMBNAIL_IMAGE:
      "This image is used in lists or previews, giving a quick visual reference for the item.",

    // Add more descriptions as needed
  },
  BUTTON: {
    EDIT: "Save",
    ADD: "Create",
    
    // Add more button labels as needed
  },
}

export const ADMIN_PER_PAGE_OPTIONS = [10, 20, 30, 40, 50]
