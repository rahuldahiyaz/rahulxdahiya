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
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

interface CompletedOrdersTableProps {
  orders: Order[]
}

type SortField = "orderNumber" | "priority" | "destination" | "orderQuantity" | "dispatchQuantity" | "updatedAt"
type SortDirection = "asc" | "desc"

export function CompletedOrdersTable({ orders }: CompletedOrdersTableProps) {
  const [sortField, setSortField] = useState<SortField>("updatedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
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

      // Handle special cases
      if (sortField === "updatedAt" || sortField === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [orders, sortField, sortDirection])

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
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
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("priority")} className="h-auto p-0 font-semibold">
                Priority {getSortIcon("priority")}
              </Button>
            </TableHead>
            <TableHead>Customer</TableHead>
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
