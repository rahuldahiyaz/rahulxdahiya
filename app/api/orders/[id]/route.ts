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
    const body = await request.json()
    const { destination, materialCode, party, mill, priority, materialDescription, orderQuantity, validUntil } = body

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role === "USER" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (order.status !== "DRAFT") {
      return NextResponse.json({ error: "Only draft orders can be edited" }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        destination,
        materialCode,
        party,
        mill,
        priority,
        materialDescription,
        orderQuantity,
        validUntil: new Date(validUntil),
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "ORDER_UPDATED",
        details: `Order ${order.orderNumber} updated`,
        userId: session.user.id,
        orderId: order.id,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role === "USER" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (order.status !== "DRAFT") {
      return NextResponse.json({ error: "Only draft orders can be deleted" }, { status: 400 })
    }

    await prisma.order.delete({
      where: { id: orderId },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "ORDER_DELETED",
        details: `Order ${order.orderNumber} deleted`,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: "Order deleted successfully" })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
