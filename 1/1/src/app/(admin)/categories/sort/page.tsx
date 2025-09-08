// ملف: app/admin/categories/sort/page.tsx
import  prisma  from "@/lib/prisma"; // غيّر المسار حسب مشروعك
import CategorySorterWrapper from './CategorySorterWrapper';
import type { Metadata } from "next"

import { verifySession } from "@/lib/dal"

export const metadata: Metadata = {
  title: "Dashboard",
}
export default async function SortCategoriesPage() {
  await verifySession({ isAdmin: true })
  const categories = await prisma.category.findMany({
    orderBy: { priority: "asc" }, // ترتيب حسب الأولوية
  });

  return (
    <div className="p-6">
      <h1>category sorting</h1>
      <CategorySorterWrapper initialCategories={categories} />
    </div>
  );
}

