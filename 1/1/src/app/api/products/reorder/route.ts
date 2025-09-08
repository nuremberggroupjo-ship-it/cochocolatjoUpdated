// app/api/products/reorder/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { orderedIds } = await req.json();

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  await Promise.all(
    orderedIds.map((id: string, index: number) =>
      prisma.product.update({
        where: { id },
        data: { priority: index },
      })
    )
  );

  revalidateTag('products'); // ضع هنا نفس التاج الذي تستخدمه لجلب المنتجات

  return NextResponse.json({ success: true });
}
