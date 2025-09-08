import { Prisma } from "@/lib/_generated/prisma"

export function getProductDataSelect(
  loggedInUser?: string,
  sessionFavoriteId?: string,
  sessionCartId?: string,
) {
  return {
    id: true,
    name: true,
    slug: true,
    price: true,
    discountPrice: true,
    isDiscountActive: true,
    stock: true,
    description: true,
    shortDescription: true,
    ingredients: true,
    // size and unit
    size: true,
    unit: true,
    //
    isActive: true,
    isFeatured: true,
    updatedAt: true,
    createdAt: true,

    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    productImages: {
      select: {
        id: true,
        imageUrl: true,
      },
    },
    attributes: {
      select: {
        attribute: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            description: true,
          },
        },
      },
    },
    favorites: {
      where: {
        OR: [
          // For authenticated users
          ...(loggedInUser ? [{ userId: loggedInUser }] : []),
          // For guest users
          ...(sessionFavoriteId && !loggedInUser
            ? [{ sessionFavoriteId, userId: null }]
            : []),
        ],
      },
      select: {
        id: true,
        userId: true,
        sessionFavoriteId: true,
        createdAt: true,
      },
    },
    cartItems: {
      where: {
        cart: {
          OR: [
            // For authenticated users
            ...(loggedInUser ? [{ userId: loggedInUser }] : []),
            // For guest users
            ...(sessionCartId && !loggedInUser
              ? [{ sessionCartId, userId: null }]
              : []),
          ],
        },
      },
      select: {
        quantity: true,
        cartId: true,
      },
    },
  } satisfies Prisma.ProductSelect
}

export type ProductData = Prisma.ProductGetPayload<{
  select: ReturnType<typeof getProductDataSelect>
}>

/**
 * Select configuration for user data in admin context
 * Includes all necessary fields for user management
 */
export function getUserDataSelect() {
  return {
    id: true,
    name: true,
    email: true,
    emailVerified: true,
    role: true,
    phone: true,
    addresses: true,
    paymentMethod: true,
    image: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.UserSelect
}

/**
 * Type for user data used in admin interface
 * Includes all fields needed for user management and display
 */
export type UserAdminData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>
}>

/**
 * Select configuration for order data in admin context
 * Includes all necessary fields for order management and display
 */
export function getOrderDataSelect() {
  return {
    id: true,
    orderNumber: true,
    status: true,
    deliveryType: true,
    shippingAddress: true,
    paymentMethod: true,
    paymentResult: true,
    itemsPrice: true,
    shippingPrice: true,
    taxPrice: true,
    totalPrice: true,
    isPaid: true,
    paidAt: true,
    isDelivered: true,
    deliveredAt: true,
    additionalNotes: true,
    guestName: true,
    guestPhone: true,
    guestEmail: true,
    createdAt: true,
    updatedAt: true,
    //new 
    is_gift:true,
    date:true,

    // Include user data for registered users
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
      },
    },

    // Include order items with product details
    orderItems: {
      select: {
        quantity: true,
        price: true,
        name: true,
        slug: true,
        image: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            productImages: {
              select: {
                imageUrl: true,
              },
              take: 1,
            },
          },
        },
      },
    },
  } satisfies Prisma.OrderSelect
}

export type OrderAdminData = Prisma.OrderGetPayload<{
  select: ReturnType<typeof getOrderDataSelect>
}>

/**
 * Simplified order data select for table display
 * Excludes heavy relations for better performance
 */
export function getOrderTableDataSelect() {
  return {
    id: true,
    orderNumber: true,
    status: true,
    deliveryType: true,
    paymentMethod: true,
    totalPrice: true,
    isPaid: true,
    paidAt: true,
    isDelivered: true,
    deliveredAt: true,
    guestName: true,
    guestEmail: true,
    createdAt: true,
    updatedAt: true,
    //new             /////////////////////////////new///////////////////////////////////////
    is_gift:true,
    date:true,

    // Simplified user data for table
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },

    // Count of order items for display
    _count: {
      select: {
        orderItems: true,
      },
    },
  } satisfies Prisma.OrderSelect
}

export type OrderTableData = Prisma.OrderGetPayload<{
  select: ReturnType<typeof getOrderTableDataSelect>
}>

/**
 * Select configuration for customer order data
 * Includes only customer-relevant fields without sensitive admin information
 * Used for customer order history table
 */
export function getCustomerOrderDataSelect() {
  return {
    id: true,
    orderNumber: true,
    status: true,
    deliveryType: true,
    paymentMethod: true,
    totalPrice: true,
    isPaid: true,
    isDelivered: true,
    createdAt: true,
    updatedAt: true,
    //new             /////////////////////////////new///////////////////////////////////////
    is_gift:true,
    date:true,

    // Count of order items for display
    _count: {
      select: {
        orderItems: true,
      },
    },
  } satisfies Prisma.OrderSelect
}

/**
 * Type for customer order data used in customer interface
 * Excludes sensitive admin fields and user information from other customers
 */
export type CustomerOrderData = Prisma.OrderGetPayload<{
  select: ReturnType<typeof getCustomerOrderDataSelect>
}>

/**
 * Select configuration for customer order details
 * Includes all necessary fields for order details page
 * Used for detailed customer order view
 */
export function getCustomerOrderDetailsSelect() {
  return {
    id: true,
    orderNumber: true,
    status: true,
    deliveryType: true,
    shippingAddress: true,
    paymentMethod: true,
    itemsPrice: true,
    shippingPrice: true,
    taxPrice: true,
    totalPrice: true,
    isPaid: true,
    paidAt: true,
    isDelivered: true,
    deliveredAt: true,
    additionalNotes: true,
    guestName: true,
    guestPhone: true,
    guestEmail: true,
    createdAt: true,
    updatedAt: true,
    //new             /////////////////////////////new///////////////////////////////////////
    is_gift:true,
    date:true,


    // Include user data for registered users
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    },

    // Include order items with product details
    orderItems: {
      select: {
        quantity: true,
        price: true,
        name: true,
        slug: true,
        image: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            productImages: {
              select: {
                imageUrl: true,
              },
              take: 1,
            },
          },
        },
      },
    },
  } satisfies Prisma.OrderSelect
}

/**
 * Type for customer order details data used in order details page
 * Includes complete order information for customer view
 */
export type CustomerOrderDetailsData = Prisma.OrderGetPayload<{
  select: ReturnType<typeof getCustomerOrderDetailsSelect>
}>
