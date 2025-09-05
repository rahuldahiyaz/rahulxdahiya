"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { format } from "date-fns"

interface Order {
  id: string
  orderNumber: string
  status: string
  priority: number
  destination: string
  materialDescription: string
  orderQuantity: number
  dispatchQuantity: number | null
  completionNotes: string | null
  validUntil: Date
  createdAt: Date
  updatedAt: Date
}

interface CompletedOrdersTableProps {
  orders: Order[]
}

export function CompletedOrdersTable({ orders }: CompletedOrdersTableProps) {
  const [sortField, setSortField] = useState<
    "orderNumber" | "priority" | "destination" | "orderQuantity" | "dispatchQuantity" | "updatedAt"
  >("updatedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (
    field: "orderNumber" | "priority" | "destination" | "orderQuantity" | "dispatchQuantity" | "updatedAt",
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

      if (sortField === "updatedAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [orders, sortField, sortDirection])

  const getSortIcon = (
    field: "orderNumber" | "priority" | "destination" | "orderQuantity" | "dispatchQuantity" | "updatedAt",
  ) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No completed orders found.</p>
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
                Ordered {getSortIcon("orderQuantity")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("dispatchQuantity")}
                className="h-auto p-0 font-semibold"
              >
                Dispatched {getSortIcon("dispatchQuantity")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("updatedAt")} className="h-auto p-0 font-semibold">
                Completed {getSortIcon("updatedAt")}
              </Button>
            </TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>
                <Badge variant="secondary">COMPLETED</Badge>
              </TableCell>
              <TableCell>{order.priority}</TableCell>
              <TableCell>{order.destination}</TableCell>
              <TableCell className="max-w-xs truncate">{order.materialDescription}</TableCell>
              <TableCell>{order.orderQuantity}</TableCell>
              <TableCell>
                <span className={order.dispatchQuantity === order.orderQuantity ? "text-green-600" : "text-orange-600"}>
                  {order.dispatchQuantity || 0}
                </span>
              </TableCell>
              <TableCell>{format(new Date(order.updatedAt), "MMM dd, yyyy")}</TableCell>
              <TableCell className="max-w-xs">
                {order.completionNotes ? (
                  <span className="text-sm text-gray-600 truncate block" title={order.completionNotes}>
                    {order.completionNotes}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">No notes</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
