import prisma from "@/lib/prisma"

/**
 * Generate unique order number: YYYYMMDD_XXXX
 */
export const generateUniqueOrderNumber = async (): Promise<string> => {
  let isUnique = false
  let orderNumber = ""

  while (!isUnique) {
    const now = new Date()
    const datePart = now
      .toISOString()
      .slice(0, 10) 
      .split("-") 
      .reverse() 
      .map((part, index) => (index === 2 ? part.slice(2) : part)) 
      .join("") 

    const randomPart = Math.floor(1000 + Math.random() * 9000) 
    orderNumber = `${datePart}_${randomPart}`

    // Check uniqueness in the DB
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    })

    if (!existingOrder) {
      isUnique = true
    }
  }

  return `Order_${orderNumber}`
}
