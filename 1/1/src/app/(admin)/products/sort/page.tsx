// app/admin/products/sort/page.tsx
import prisma from "@/lib/prisma"; // تأكد من مسار الاستيراد
import ProductSorterWrapper from './ProductSorterWrapper';
import type { Metadata } from "next"

import { verifySession } from "@/lib/dal"

export const metadata: Metadata = {
  title: "Dashboard",
}
export default async function SortProductsPage() {
  await verifySession({ isAdmin: true })
  const products = await prisma.product.findMany({
    orderBy: { priority: "asc" },
    include: {
      productImages: true,  // تجلب كل الصور المرتبطة بكل منتج
    },
  });

  // تحويل المنتجات لتضمين thumbnailImage
  const transformedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    thumbnailImage:
      product.productImages.length > 0
        ? product.productImages[0].imageUrl
        : '/default-image.png', // ضع هنا رابط صورة افتراضية لو تحب
  }));

  return (
    <div className="p-6">
      <h1>Product Sorting</h1>
      <ProductSorterWrapper initialProducts={transformedProducts} />
    </div>
  );
}
