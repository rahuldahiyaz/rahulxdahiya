"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { format } from "date-fns"
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
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

interface OrderFulfillmentTableProps {
  orders: Order[]
}

export function OrderFulfillmentTable({ orders }: OrderFulfillmentTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fulfillmentData, setFulfillmentData] = useState({
    dispatchQuantity: "",
    completionNotes: "",
  })

  const [sortField, setSortField] = useState<
    "orderNumber" | "priority" | "destination" | "orderQuantity" | "validUntil" | "createdAt"
  >("priority")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const { toast } = useToast()

  const handleComplete = async () => {
    if (!selectedOrder) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dispatchQuantity: Number.parseInt(fulfillmentData.dispatchQuantity),
          completionNotes: fulfillmentData.completionNotes,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order completed successfully!",
        })
        setSelectedOrder(null)
        setFulfillmentData({ dispatchQuantity: "", completionNotes: "" })
        window.location.reload()
      }
    } catch (error) {
      console.error("Error completing order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openFulfillmentDialog = (order: Order) => {
    setSelectedOrder(order)
    setFulfillmentData({
      dispatchQuantity: order.orderQuantity.toString(),
      completionNotes: "",
    })
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

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("orderNumber")}>
                Order # {getSortIcon("orderNumber")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("priority")}>
                Priority {getSortIcon("priority")}
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("destination")}>
                Destination {getSortIcon("destination")}
              </TableHead>
              <TableHead>Material</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("orderQuantity")}>
                Quantity {getSortIcon("orderQuantity")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("validUntil")}>
                Valid Until {getSortIcon("validUntil")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <Badge variant={order.priority <= 50 ? "destructive" : "outline"}>{order.priority}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{order.destination}</TableCell>
                <TableCell className="max-w-xs truncate">{order.materialDescription}</TableCell>
                <TableCell>{order.orderQuantity}</TableCell>
                <TableCell>{format(new Date(order.validUntil), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => openFulfillmentDialog(order)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Fulfillment Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Order</DialogTitle>
            <DialogDescription>Fill in the fulfillment details to mark this order as completed.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Order Details</h4>
                <p>
                  <strong>Order #:</strong> {selectedOrder.orderNumber}
                </p>
                <p>
                  <strong>Customer:</strong> {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                </p>
                <p>
                  <strong>Material:</strong> {selectedOrder.materialDescription}
                </p>
                <p>
                  <strong>Requested Quantity:</strong> {selectedOrder.orderQuantity}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dispatchQuantity">Dispatch Quantity</Label>
                <Input
                  id="dispatchQuantity"
                  type="number"
                  value={fulfillmentData.dispatchQuantity}
                  onChange={(e) => setFulfillmentData((prev) => ({ ...prev, dispatchQuantity: e.target.value }))}
                  placeholder="Enter dispatch quantity"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionNotes">Completion Notes</Label>
                <Textarea
                  id="completionNotes"
                  value={fulfillmentData.completionNotes}
                  onChange={(e) => setFulfillmentData((prev) => ({ ...prev, completionNotes: e.target.value }))}
                  placeholder="Add any notes about the fulfillment..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Cancel
                </Button>
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Mark as Completed
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
