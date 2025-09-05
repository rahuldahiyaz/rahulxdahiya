import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Package, CheckCircle, TrendingUp } from "lucide-react"
import { OrderFulfillmentTable } from "@/components/operations/order-fulfillment-table"
import { CompletedOrdersTable } from "@/components/operations/completed-orders-table"
import { OperationsHeader } from "@/components/operations/operations-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function OrderFulfillmentPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "OPERATIONS_MANAGER") {
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

  // Get finalized and completed orders with statistics
  const [finalizedOrders, completedOrders, orderStats] = await Promise.all([
    prisma.order.findMany({
      where: { status: "FINALIZED" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { status: "COMPLETED" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 50, // Limit to recent 50 completed orders
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ])

  const stats = {
    pending: orderStats.find((s) => s.status === "FINALIZED")?._count.status || 0,
    completed: orderStats.find((s) => s.status === "COMPLETED")?._count.status || 0,
    total: orderStats.reduce((acc, curr) => acc + curr._count.status, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <OperationsHeader user={userProfile} />

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All orders in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Orders completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Orders ({stats.pending})</TabsTrigger>
            <TabsTrigger value="completed">Completed Orders ({stats.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Orders Awaiting Fulfillment</CardTitle>
                    <CardDescription>Process and complete finalized orders</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-orange-600">
                    {stats.pending} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {finalizedOrders.length > 0 ? (
                  <OrderFulfillmentTable orders={finalizedOrders} />
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders to Process</h3>
                    <p className="text-gray-600">All orders have been processed. Great work!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Completed Orders</CardTitle>
                    <CardDescription>Recently completed and fulfilled orders</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-green-600">
                    {stats.completed} Completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {completedOrders.length > 0 ? (
                  <CompletedOrdersTable orders={completedOrders} />
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Orders</h3>
                    <p className="text-gray-600">Completed orders will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
