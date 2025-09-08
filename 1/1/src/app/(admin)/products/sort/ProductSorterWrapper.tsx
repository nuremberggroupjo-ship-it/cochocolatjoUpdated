'use client';

import React, { useEffect, useState } from 'react';
import { ProductSorter } from './ProductSorter';
import type { Product } from './ProductSorter';  // استيراد النوع

interface ProductSorterWrapperProps {
  initialProducts: Product[];  // استخدام النوع بدل any
}

export default function ProductSorterWrapper({ initialProducts }: ProductSorterWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <ProductSorter initialProducts={initialProducts} />;
}
