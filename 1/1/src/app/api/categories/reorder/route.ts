import { revalidateTag } from 'next/cache';
import  prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { orderedIds } = await req.json();

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  await Promise.all(
    orderedIds.map((id: string, index: number) =>
      prisma.category.update({
        where: { id },
        data: { priority: index },
      })
    )
  );


  // ...
  
  revalidateTag('categories'); // هذا نفس التاج الموجود في getCategories
  
  return NextResponse.json({ success: true });
}
