'use client';

import React, { useEffect, useState } from 'react';
import { CategorySorter } from '../sort/category-sorter';
import type { Category } from '../sort/category-sorter'; // ✅ استيراد نوع Category

interface CategorySorterWrapperProps {
  initialCategories: Category[]; // ✅ استخدام النوع الصحيح بدل any[]
}

export default function CategorySorterWrapper({ initialCategories }: CategorySorterWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // لا تعرض شيء أثناء الـ SSR

  return <CategorySorter initialCategories={initialCategories} />;
}
