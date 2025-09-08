import { UTApi } from "uploadthing/server"

import { env } from "@/lib/env"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")

    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      })
    }

    const unusedMedia = await prisma.productImage.findMany({
      where: {
        productId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
              },
            }
          : {}),
      },
      select: {
        id: true,
        imageUrl: true,
      },
    })

    new UTApi().deleteFiles(
      unusedMedia.map(
        (m) =>
          m.imageUrl.split(
            `https://${env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/`,
          )[1],
      ),
    )

    await prisma.productImage.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((m) => m.id),
        },
      },
    })

    return new Response()
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
