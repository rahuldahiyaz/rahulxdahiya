import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "OPERATIONS_MANAGER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id
    const { dispatchQuantity, completionNotes } = await request.json()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.status !== "FINALIZED") {
      return NextResponse.json({ error: "Only finalized orders can be completed" }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        dispatchQuantity,
        completionNotes,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "ORDER_COMPLETED",
        details: `Order ${order.orderNumber} completed with dispatch quantity ${dispatchQuantity}`,
        userId: session.user.id,
        orderId: order.id,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error completing order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
