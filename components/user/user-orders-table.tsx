"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Send, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { format } from "date-fns"
import { EditOrderDialog } from "@/components/user/edit-order-dialog"
import { useToast } from "@/components/ui/use-toast"

interface Order {
  id: string
  orderNumber: string
  status: string
  priority: number
  destination: string
  materialDescription: string
  orderQuantity: number
  validUntil: Date
  createdAt: Date
}

interface UserOrdersTableProps {
  orders: Order[]
}

export function UserOrdersTable({ orders }: UserOrdersTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [sortField, setSortField] = useState<
    "orderNumber" | "priority" | "destination" | "orderQuantity" | "validUntil" | "createdAt"
  >("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "outline"
      case "FINALIZED":
        return "default"
      case "COMPLETED":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "orange"
      case "FINALIZED":
        return "blue"
      case "COMPLETED":
        return "green"
      default:
        return "gray"
    }
  }

  const handleFinalize = async (orderId: string) => {
    setIsLoading(orderId)
    try {
      const response = await fetch(`/api/orders/${orderId}/finalize`, {
        method: "PATCH",
      })
      if (response.ok) {
        window.location.reload()
        toast({
          title: "Order Finalized",
          description: "Your order has been successfully finalized.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error finalizing order:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return

    setIsLoading(orderId)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        window.location.reload()
        toast({
          title: "Order Deleted",
          description: "Your order has been successfully deleted.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting order:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleSort = (
    field: "orderNumber" | "priority" | "destination" | "orderQuantity" | "validUntil" | "createdAt",
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "validUntil" || sortField === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [orders, sortField, sortDirection])

  const getSortIcon = (
    field: "orderNumber" | "priority" | "destination" | "orderQuantity" | "validUntil" | "createdAt",
  ) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No orders found. Create your first order to get started!</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("orderNumber")} className="h-auto p-0 font-semibold">
                Order # {getSortIcon("orderNumber")}
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("priority")} className="h-auto p-0 font-semibold">
                Priority {getSortIcon("priority")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("destination")} className="h-auto p-0 font-semibold">
                Destination {getSortIcon("destination")}
              </Button>
            </TableHead>
            <TableHead>Material</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("orderQuantity")} className="h-auto p-0 font-semibold">
                Quantity {getSortIcon("orderQuantity")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("validUntil")} className="h-auto p-0 font-semibold">
                Valid Until {getSortIcon("validUntil")}
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)} color={getStatusBadgeColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.priority}</TableCell>
              <TableCell>{order.destination}</TableCell>
              <TableCell className="max-w-xs truncate">{order.materialDescription}</TableCell>
              <TableCell>{order.orderQuantity}</TableCell>
              <TableCell>{format(new Date(order.validUntil), "MMM dd, yyyy")}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {order.status === "DRAFT" && (
                    <>
                      <EditOrderDialog order={order} />
                      <Button size="sm" onClick={() => handleFinalize(order.id)} disabled={isLoading === order.id}>
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(order.id)}
                        disabled={isLoading === order.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
