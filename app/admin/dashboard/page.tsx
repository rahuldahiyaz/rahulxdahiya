import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, TrendingUp, Clock } from "lucide-react"
import { UserManagement } from "@/components/admin/user-management"
import { OrderOverview } from "@/components/admin/order-overview"
import { AdminHeader } from "@/components/admin/admin-header"
import { OrdersChart } from "@/components/admin/orders-chart"
import { OrderStatusChart } from "@/components/admin/order-status-chart"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
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

  // Get dashboard statistics
  const [totalUsers, totalOrders, pendingOrders, completedOrders] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "FINALIZED" } }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
  ])

  // Get orders data for charts
  const ordersData = await prisma.order.findMany({
    select: {
      createdAt: true,
      status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader user={userProfile} />

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">All orders in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2563eb]">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#16a34a]">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
              <CardDescription>Monthly order trends for the past 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersChart ordersData={ordersData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
              <CardDescription>Current distribution of order statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderStatusChart ordersData={ordersData} />
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="space-y-8">
          {/* User Management - Full Width */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and assign roles</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>

          {/* Order Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders and system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderOverview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
