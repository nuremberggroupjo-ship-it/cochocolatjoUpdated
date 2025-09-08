// app/(shop)/(content)/categories/[slug]/types.ts

export interface ShopNowPageProps {
    params: Promise<{
      slug: string | string[];
    }>
    searchParams: Promise<{
      q?: string;
      page?: string;
      category?: string | string[];
      attribute?: string | string[];
      sort?: string;
      sale?: string | string[];
      unit?: string | string[];
    }>
  }
  