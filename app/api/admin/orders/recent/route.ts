import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
