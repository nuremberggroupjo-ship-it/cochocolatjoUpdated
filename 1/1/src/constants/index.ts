import type { ShopMainNavItem, SocialLink } from "@/types"

import FacebookSvg from "@/assets/svg/facebook.svg"
import InstagramSvg from "@/assets/svg/instagram.svg"
import WhatsAppSvg from "@/assets/svg/whatsapp.svg"

import { env } from "@/lib/env"

export const SHOP_MAIN_NAV_LIST: ShopMainNavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "categories", label: "Categories", href: "/categories" },
  { id: "shop-now", label: "Shop Now", href: "/shop-now" },
  { id: "about-us", label: "About Us", href: "/about-us" },
  { id: "contact-us", label: "Contact Us", href: "#contact"},
]

export const FOOTER_ADDRESS = {
  location_label:
    env.NEXT_PUBLIC_LOCATION_LABEL || "KADI Building, Yathreb Street, Dabouq",
  location_link:
    env.NEXT_PUBLIC_LOCATION_LINK ||
    "https://www.google.com/maps/place/Co+Chocolat+Jordan/@32.0082705,35.8326355,17z/data=!3m1!4b1!4m6!3m5!1s0x151ca1721b391b2d:0xba1266d1e6c270f6!8m2!3d32.0082705!4d35.8326355!16s%2Fg%2F11xrfcx75y?entry=ttu&g_ep=EgoyMDI1MDgxMS4wIKXMDSoASAFQAw%3D%3D",
  phoneNumber: env.NEXT_PUBLIC_PHONE_NUMBER || "+962 7 9330 8808",
  email: env.NEXT_PUBLIC_EMAIL ,
  openingHours:
    env.NEXT_PUBLIC_OPENING_HOURS ||
    "Sat-Thu: 10 AM - 10 PM | Friday: 2 PM - 10 PM",
}
export const NUREMBERG_GROUP_HREF = "https://nurembergtech.com/"

export const PRODUCTS_PER_PAGE = 9
export const FEATURED_PRODUCTS_PER_PAGE = 5

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "whatsapp",
    icon: WhatsAppSvg,
    name: "WhatsApp",
    href: `https://wa.me/${FOOTER_ADDRESS.phoneNumber.replace(/\s+/g, "")}?text=Hello, I would like to know more about your services.`,
  },
  {
    id: "facebook",
    icon: FacebookSvg,
    name: "Facebook",
    href:
      env.NEXT_PUBLIC_FACEBOOK_URL ||
      "https://web.facebook.com/cochocolat.jordan/",
  },
  {
    id: "instagram",
    icon: InstagramSvg,
    name: "Instagram",
    href:
      env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://www.instagram.com/cochocolat.jo",
  },
]

export const DIALOG_TEXTS = {
  DELETE_CONFIRMATION: {
    TITLE: "Are you absolutely sure?",
    DESCRIPTION: (items?: string) => {
      const withoutItems =
        "This action cannot be undone. This will permanently delete your data from our servers."
      return items
        ? `This action cannot be undone. This will permanently delete <strong style="color:var(--destructive);">${items}</strong> from the servers.`
        : withoutItems
    },
  },
}

// ACTIONS - API
export const API_RESPONSE_MESSAGES = {
  // Standard error messages
  NOT_FOUND: (entity: string, identifier?: string) =>
    identifier ? `${entity} '${identifier}' not found` : `${entity} not found`,
  ALREADY_IN_USE: (field: string, value: string) =>
    `${field} '${value}' is already in use`,
  INVALID_INPUT: (field: string) => `${field} is required.`,
  ALREADY_EXISTS: (entity: string, value: string) =>
    `${entity} '${value}' already exists.`,

  INTERNAL_SERVER_ERROR: "Internal Server Error",

  // Standard success messages
  RETRIEVED_SUCCESS: (entity: string) => `${entity} retrieved successfully.`,
  DELETED_SUCCESS: (entity: string) => `${entity} deleted successfully.`,
  CREATED_SUCCESS: (entity: string) => `${entity} created successfully.`,
  UPDATED_SUCCESS: (entity: string) => `${entity} updated successfully.`,
}

export const REVALIDATE_TAGS = {
  BANNERS: "banners",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  ATTRIBUTES: "attributes",
  CART: "cart",
  FAVORITES: "favorites",
  USERS: "users",
  ORDERS: "orders",
}

// Re-export metadata constants
export * from "./metadata"
