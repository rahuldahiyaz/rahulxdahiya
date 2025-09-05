import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, CheckCircle, FileText } from "lucide-react"
import { UserOrdersTable } from "@/components/user/user-orders-table"
import { CompletedOrdersTable } from "@/components/user/completed-orders-table"
import { CreateOrderDialog } from "@/components/user/create-order-dialog"
import { UserHeader } from "@/components/user/user-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function UserDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "USER") {
    redirect("/unauthorized")
  }

  // Get user profile
  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      department: true,
      designation: true,
      profilePhoto: true,
    },
  })

  // Get user's orders and statistics
  const [allOrders, orderStats] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: { status: true },
    }),
  ])

  // Separate orders by status
  const activeOrders = allOrders.filter((order) => order.status !== "COMPLETED")
  const completedOrders = allOrders.filter((order) => order.status === "COMPLETED")

  const stats = {
    total: allOrders.length,
    draft: orderStats.find((s) => s.status === "DRAFT")?._count.status || 0,
    completed: orderStats.find((s) => s.status === "COMPLETED")?._count.status || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <UserHeader user={userProfile} />

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All your orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#e6cb5e]">{stats.draft}</div>
              <p className="text-xs text-muted-foreground">Ready to finalize</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#16a34a]">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
            </TabsList>
            <CreateOrderDialog />
          </div>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
                <CardDescription>Manage your draft and processing orders</CardDescription>
              </CardHeader>
              <CardContent>
                <UserOrdersTable orders={activeOrders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Orders</CardTitle>
                <CardDescription>View your successfully completed orders</CardDescription>
              </CardHeader>
              <CardContent>
                <CompletedOrdersTable orders={completedOrders} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
