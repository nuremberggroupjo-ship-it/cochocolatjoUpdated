import type { Metadata } from "next";

import { env } from "@/lib/env";

export const APP_TITLE =
  process.env.NODE_ENV === "development" ? "Dev" : "CO Chocolat";
export const APP_DESCRIPTION =
  "Discover CO Chocolat's premium handcrafted chocolates made with the finest ingredients. From artisan truffles to gourmet pralines, experience luxury chocolate delivered across Jordan.";
export const SERVER_URL = env.NEXT_PUBLIC_BASE_URL;

// Common keywords that appear across multiple pages
export const COMMON_KEYWORDS = [
  // English keywords
  "chocolate",
  "cookies",
  "premium chocolate",
  "artisan chocolate",
  "handcrafted chocolate",
  "gourmet chocolate",
  "luxury chocolate",
  "fine chocolate",
  "Belgian chocolate",
  "Swiss chocolate",
  "dark chocolate",
  "milk chocolate",
  "white chocolate",
  "chocolate truffles",
  "chocolate pralines",
  "chocolate bars",
  "chocolate bonbons",
  "chocolate confectionery",
  "Jordan chocolate",
  "Amman chocolate",
  "chocolate shop",
  "chocolate store",
  "chocolate boutique",
  "chocolate gifts",
  "chocolate presents",
  "chocolate hampers",
  "chocolate boxes",
  "chocolate delivery",
  "chocolate online",
  "buy chocolate",
  "order chocolate",
  "chocolate treat",
  "chocolate dessert",
  "chocolate sweets",
  "CO Chocolat",
  "cochocolat",
  "co chocolat jordan",

  // Arabic keywords
  "شوكولاتة",
  "شوكولاته",
  "شوكولا",
  "شوكولاتة فاخرة",
  "شوكولاتة راقية",
  "شوكولاتة يدوية",
  "شوكولاتة حرفية",
  "شوكولاتة بلجيكية",
  "شوكولاتة سويسرية",
  "شوكولاتة داكنة",
  "شوكولاتة بالحليب",
  "شوكولاتة بيضاء",
  "ترافل شوكولاتة",
  "براولين شوكولاتة",
  "ألواح شوكولاتة",
  "بونبون شوكولاتة",
  "حلويات شوكولاتة",
  "شوكولاتة أردنية",
  "شوكولاتة عمان",
  "محل شوكولاتة",
  "متجر شوكولاتة",
  "بوتيك شوكولاتة",
  "هدايا شوكولاتة",
  "هدايا حلويات",
  "سلال شوكولاتة",
  "علب شوكولاتة",
  "توصيل شوكولاتة",
  "شوكولاتة اونلاين",
  "شراء شوكولاتة",
  "طلب شوكولاتة",
  "حلى شوكولاتة",
  "حلوى شوكولاتة",
  "حلويات فاخرة",
  "كو شوكولات",
  "سي او شوكولات",
  "شوكولاتة الأردن",
] as const;

// Page-specific metadata configurations
export const PAGE_METADATA: Record<string, Metadata> = {
  // Home page
  home: {
    title: "CO Chocolat-Finally,truly healthy chocolates",
    description:
      "Discover CO Chocolat's handcrafted premium chocolates made with the finest Belgian and Swiss ingredients. From dark chocolate truffles to milk chocolate pralines, experience luxury chocolate delivered fresh across Jordan and Amman.",
    keywords: [
      ...COMMON_KEYWORDS,
      "chocolate shop Jordan",
      "online chocolate store",
      "handmade chocolates Amman",
      "chocolate boutique",
      "luxury chocolates Jordan",
      "Jordan sweets",
      "chocolate online Jordan",
      "best chocolate shop",
      "artisan chocolatier",
      "gourmet sweets",
      "chocolate craftsmanship",
      "finest chocolate",
      "chocolate artisan",
      "محل شوكولاتة الأردن",
      "أفضل شوكولاتة عمان",
      "حلويات راقية الأردن",
      "شوكولاتة طازجة",
      "صناعة شوكولاتة يدوية",
    ].join(", "),
  },

  // Shop Now page
  shopNow: {
    title: "CO Chocolat-Shop Now",
    description:
      "Browse CO Chocolat's complete collection of premium artisan chocolates. From Belgian dark chocolate bars to handcrafted truffles and gourmet gift boxes, find your perfect chocolate treats with fast delivery across Jordan.",
    keywords: [
      ...COMMON_KEYWORDS,
      "shop chocolate online",
      "buy chocolate Jordan",
      "chocolate products",
      "chocolate collection",
      "order chocolate online",
      "chocolate catalog",
      "premium sweets online",
      "chocolate shopping",
      "chocolate e-commerce",
      "buy premium chocolate",
      "chocolate varieties",
      "chocolate selection",
      "شراء شوكولاتة اونلاين",
      "طلب شوكولاتة",
      "تسوق شوكولاتة",
      "مجموعة شوكولاتة",
      "أنواع شوكولاتة",
    ].join(", "),
  },

  // Categories page
  categories: {
    title: "CO Chocolat-Categories",
    description:
      "Explore CO Chocolat's diverse chocolate categories - from rich dark chocolate and creamy milk chocolate to elegant white chocolate, artisan truffles, pralines, and gourmet chocolate bars. Discover your favorite type today.",
    keywords: [
      ...COMMON_KEYWORDS,
      "chocolate categories",
      "chocolate types",
      "chocolate varieties",
      "dark chocolate collection",
      "milk chocolate selection",
      "white chocolate range",
      "chocolate truffles collection",
      "pralines selection",
      "chocolate bars variety",
      "bonbons collection",
      "chocolate assortment",
      "gourmet chocolate types",
      "أنواع شوكولاتة",
      "فئات شوكولاتة",
      "أصناف شوكولاتة",
      "شوكولاتة داكنة",
      "شوكولاتة بالحليب",
      "شوكولاتة بيضاء",
      "ترافل شوكولاتة",
      "براولين",
    ].join(", "),
  },

  // About Us page
  aboutUs: {
    title: "CO Chocolat-About Us",
    description:
      "Learn about CO Chocolat's journey from a passion for fine chocolate to Jordan's premier artisan chocolatier. Discover our commitment to quality ingredients, traditional craftsmanship, and creating exceptional chocolate experiences.",
    keywords: [
      ...COMMON_KEYWORDS,
      "about CO Chocolat",
      "chocolate story",
      "artisan chocolatier Jordan",
      "quality chocolate maker",
      "chocolate craftsmanship",
      "Jordan chocolatier",
      "chocolate heritage",
      "premium chocolate brand",
      "chocolate company Jordan",
      "chocolate expertise",
      "chocolate passion",
      "handcrafted chocolate story",
      "عن كو شوكولات",
      "قصة شوكولاتة",
      "صانع شوكولاتة أردني",
      "خبرة شوكولاتة",
      "تراث شوكولاتة",
      "شركة شوكولاتة أردنية",
    ].join(", "),
  },

  // Cart page
  cart: {
    title: "Shopping Cart",
    description:
      "Review your selected premium chocolates and proceed to secure checkout. Enjoy fast delivery across Jordan with our convenient online ordering system. Your luxury chocolate experience is just one click away.",
    keywords: [
      ...COMMON_KEYWORDS,
      "chocolate cart",
      "chocolate checkout",
      "order review",
      "shopping cart chocolate",
      "chocolate order process",
      "secure chocolate ordering",
      "chocolate purchase",
      "buy chocolate online",
      "سلة شوكولاتة",
      "طلب شوكولاتة",
      "شراء شوكولاتة آمن",
    ].join(", "),
  },

  // Favorites page
  favorites: {
    title: "Your Favorite Chocolates",
    description:
      "Your carefully curated collection of favorite chocolates from CO Chocolat. Keep track of your preferred premium chocolates, artisan truffles, and gourmet treats for easy reordering anytime.",
    keywords: [
      ...COMMON_KEYWORDS,
      "favorite chocolates",
      "saved chocolates",
      "chocolate wishlist",
      "preferred chocolates",
    ].join(", "),
  },

  // Order History page
  orderHistory: {
    title: "Order History",
    description:
      "Track your CO Chocolat orders and view your complete purchase history. Monitor delivery status, reorder your favorite chocolates, and manage all your premium chocolate purchases from one convenient location.",
    keywords: [
      ...COMMON_KEYWORDS,
      "order history",
      "chocolate orders",
      "order tracking",
      "purchase history",
      "my orders",
    ].join(", "),
  },

  // Privacy Policy page
  privacy: {
    title: "Privacy Policy",
    description:
      "Read CO Chocolat's comprehensive privacy policy to understand how we protect your personal information, secure your data, and ensure your privacy while you enjoy our premium chocolate shopping experience.",
    keywords: [
      "privacy policy",
      "data protection",
      "personal information",
      "GDPR",
      "privacy rights",
      "CO Chocolat privacy",
    ].join(", "),
  },

  // Auth pages
  login: {
    title: "Login",
    description:
      "Login to your CO Chocolat account to access your favorite chocolates, track order history, and enjoy personalized recommendations. Secure access to your premium chocolate shopping experience.",
    keywords: [
      ...COMMON_KEYWORDS,
      "login",
      "sign in",
      "account access",
      "customer login",
      "chocolate account",
    ].join(", "),
  },

  register: {
    title: "Create Account",
    description:
      "Create your CO Chocolat account to save favorite chocolates, track orders, and enjoy a personalized premium chocolate shopping experience. Join our community of chocolate lovers in Jordan today.",
    keywords: [
      ...COMMON_KEYWORDS,
      "register",
      "sign up",
      "create account",
      "new customer",
      "chocolate account",
    ].join(", "),
  },

  // Error page
  authError: {
    title: "Authentication Error",
    description:
      "An authentication error occurred while accessing your CO Chocolat account. Please try logging in again or contact our customer support team for assistance with your chocolate shopping experience.",
  },

  // Checkout pages
  checkout: {
    title: "Checkout",
    description:
      "Complete your premium chocolate order with CO Chocolat's secure checkout process. Choose between convenient delivery across Jordan or store pickup for your artisan chocolates and gourmet treats.",
    keywords: [
      ...COMMON_KEYWORDS,
      "checkout",
      "secure payment",
      "order completion",
      "chocolate delivery",
      "chocolate pickup",
    ].join(", "),
  },

  checkoutDelivery: {
    title: "Delivery Information",
    description:
      "Enter your delivery details for premium chocolate delivery across Jordan. CO Chocolat offers fast, secure delivery service to bring our artisan chocolates directly to your doorstep in Amman and beyond.",
    keywords: [
      ...COMMON_KEYWORDS,
      "chocolate delivery",
      "delivery information",
      "shipping details",
      "Jordan delivery",
    ].join(", "),
  },

  checkoutPickup: {
    title: "Pickup Information",
    description:
      "Schedule your premium chocolate pickup from CO Chocolat's store. Choose convenient pickup times and ensure your artisan chocolates and gourmet treats are ready when you arrive at our Jordan location.",
    keywords: [
      ...COMMON_KEYWORDS,
      "chocolate pickup",
      "store pickup",
      "collection details",
      "pickup schedule",
    ].join(", "),
  },

  checkoutSuccess: {
    title: "Order Confirmed",
    description:
      "Your premium chocolate order has been successfully placed with CO Chocolat! Thank you for choosing our artisan chocolates. Track your order and get ready to enjoy the finest chocolate experience in Jordan.",
    keywords: [
      ...COMMON_KEYWORDS,
      "order confirmation",
      "successful order",
      "chocolate order placed",
      "order success",
    ].join(", "),
  },

  paymentMethod: {
    title: "Payment Method",
    description:
      "Choose your preferred payment method for your CO Chocolat order. We offer secure and convenient payment options to make purchasing our premium artisan chocolates safe and hassle-free across Jordan.",
    keywords: [
      ...COMMON_KEYWORDS,
      "payment method",
      "secure payment",
      "payment options",
      "chocolate payment",
    ].join(", "),
  },

  placeOrder: {
    title: "Place Order",
    description:
      "Review and finalize your CO Chocolat order. This is the final step to secure your premium artisan chocolates and gourmet treats. Complete your purchase and get ready to enjoy luxury chocolate.",
    keywords: [
      ...COMMON_KEYWORDS,
      "place order",
      "order review",
      "final checkout",
      "complete order",
    ].join(", "),
  },
};

// Dynamic metadata generators
export const generateDynamicMetadata = {
  // Product page metadata
  product: (product: {
    name: string;
    description?: string;
    slug: string;
    images?: string[];
  }): Metadata => {
    const description =
      product.description ||
      `Discover ${product.name} - premium artisan chocolate from CO Chocolat. Handcrafted with the finest Belgian and Swiss ingredients, this luxury chocolate offers an exceptional taste experience delivered fresh across Jordan.`;

    const productImage = product.images?.[0] || "/opengraph-image.jpg";

    return {
      title: product.name,
      description,
      keywords: [
        ...COMMON_KEYWORDS,
        product.name,
        `${product.name} chocolate`,
        "chocolate product",
        "premium chocolate product",
      ].join(", "),
      openGraph: {
        title: product.name,
        description,
        type: "website",
        siteName: "CO Chocolat",
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: [productImage],
      },
    };
  },

  // Category page metadata
  category: (
    category: { name: string; description?: string; slug: string },
    page?: number
  ): Metadata => {
    const title = page ? `${category.name} - Page ${page}` : category.name;
    const description =
      category.description ||
      `Explore ${category.name} chocolates from CO Chocolat's premium collection. Discover artisan-crafted luxury chocolates in the ${category.name} category, made with finest ingredients and delivered across Jordan.`;

    return {
      title,
      description,
      keywords: [
        ...COMMON_KEYWORDS,
        category.name,
        `${category.name} chocolate`,
        `${category.name} category`,
        "chocolate category",
      ].join(", "),
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "CO Chocolat",
        images: [
          {
            url: "/opengraph-image.jpg",
            width: 1200,
            height: 630,
            alt: `${category.name} - CO Chocolat`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/opengraph-image.jpg"],
      },
    };
  },

  // Search results metadata
  searchResults: (query: string): Metadata => {
    const title = `Search Results for "${query}"`;
    const description = `Find premium chocolates matching "${query}" in CO Chocolat's artisan collection. Browse our handcrafted luxury chocolates, gourmet treats, and discover your perfect chocolate match with delivery across Jordan.`;

    return {
      title,
      description,
      keywords: [
        ...COMMON_KEYWORDS,
        query,
        "chocolate search",
        "search results",
        "find chocolate",
      ].join(", "),
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "CO Chocolat",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  },

  // Order details metadata
  orderDetails: (orderNumber: string): Metadata => {
    const title = `Order #${orderNumber}`;
    const description = `View complete details for CO Chocolat order #${orderNumber}. Track your premium chocolate delivery status, review your artisan chocolate selections, and monitor your luxury chocolate order progress.`;

    return {
      title,
      description,
      keywords: [
        ...COMMON_KEYWORDS,
        "order details",
        "order tracking",
        `order ${orderNumber}`,
        "chocolate order",
      ].join(", "),
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "CO Chocolat",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  },

  // Favorites category metadata
  favoritesCategory: (category: { name: string; slug: string }): Metadata => {
    const title = `Favorite ${category.name}`;
    const description = `Your favorite ${category.name} chocolates. Keep track of your preferred chocolates in this category.`;

    return {
      title,
      description,
      keywords: [
        ...COMMON_KEYWORDS,
        `favorite ${category.name}`,
        "favorite chocolates",
        "saved chocolates",
        category.name,
      ].join(", "),
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "CO Chocolat",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  },
};

// Base metadata configuration with OpenGraph and Twitter
export const baseMetadata: Metadata = {
  metadataBase: new URL(SERVER_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CO Chocolat",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "CO Chocolat - Premium Artisan Chocolates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cochocolat",
    creator: "@cochocolat",
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

// Helper function to merge metadata with base metadata
export const createMetadata = (pageMetadata: Metadata): Metadata => {
  const merged: Metadata = {
    ...baseMetadata,
    ...pageMetadata,
  };

  // Ensure og:site_name is always present
  if (merged.openGraph) {
    merged.openGraph = {
      ...merged.openGraph,
      siteName: "CO Chocolat",
    };
  }

  return merged;
};

// Root layout metadata configuration
export const ROOT_METADATA: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s - ${APP_TITLE}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    siteName: "CO Chocolat",
    url: SERVER_URL,
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "CO Chocolat - Premium Artisan Chocolates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cochocolat",
    creator: "@cochocolat",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
