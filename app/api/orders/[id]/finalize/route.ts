import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id

    // Check if order exists and belongs to user (for USER role)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (session.user.role === "USER" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (order.status !== "DRAFT") {
      return NextResponse.json({ error: "Only draft orders can be finalized" }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "FINALIZED" },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "ORDER_FINALIZED",
        details: `Order ${order.orderNumber} finalized`,
        userId: session.user.id,
        orderId: order.id,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error finalizing order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
