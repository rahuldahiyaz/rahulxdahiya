import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ message: "If an account with that email exists, we've sent reset instructions." })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to user (you'll need to add these fields to your User model)
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // In a real application, you would send an email here
    // For demo purposes, we'll just log the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    console.log("Password reset link:", resetUrl)

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "PASSWORD_RESET_REQUESTED",
        details: `Password reset requested for ${email}`,
        userId: user.id,
      },
    })

    return NextResponse.json({ message: "If an account with that email exists, we've sent reset instructions." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
