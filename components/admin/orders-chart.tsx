"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface OrdersChartProps {
  ordersData: Array<{
    createdAt: Date
    status: string
  }>
}

export function OrdersChart({ ordersData }: OrdersChartProps) {
  const chartData = useMemo(() => {
    // Get last 12 months
    const months = []
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        date: date,
        total: 0,
        draft: 0,
        finalized: 0,
        completed: 0,
      })
    }

    // Count orders by month
    ordersData.forEach((order) => {
      const orderDate = new Date(order.createdAt)
      const monthIndex = months.findIndex(
        (m) => m.date.getMonth() === orderDate.getMonth() && m.date.getFullYear() === orderDate.getFullYear(),
      )

      if (monthIndex !== -1) {
        months[monthIndex].total++
        if (order.status === "DRAFT") months[monthIndex].draft++
        else if (order.status === "FINALIZED") months[monthIndex].finalized++
        else if (order.status === "COMPLETED") months[monthIndex].completed++
      }
    })

    return months
  }, [ordersData])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#8884d8"
            strokeWidth={2}
            name="Total Orders"
            dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="draft"
            stroke="#e6cb5e"
            strokeWidth={2}
            name="Draft Orders"
            dot={{ fill: "#e6cb5e", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="finalized"
            stroke="#2563eb"
            strokeWidth={2}
            name="Finalized Orders"
            dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#16a34a"
            strokeWidth={2}
            name="Completed Orders"
            dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
