"use client"

import type React from "react"
import { useToast } from "@/components/ui/use-toast"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Loader2 } from "lucide-react"

const DESTINATIONS = [
  "Tata Steel",
  "JSW Steel",
  "Steel Authority of India Limited (SAIL)",
  "Jindal Steel and Power Limited (JSPL)",
  "ArcelorMittal Nippon Steel India (AM/NS India)",
  "Essar Steel (now part of AM/NS India)",
  "Tata Steel BSL (formerly Bhushan Steel)",
  "Electrosteel Steels Ltd (Vedanta Group)",
  "Rashtriya Ispat Nigam Limited (RINL, Vizag Steel)",
  "Jindal Stainless Ltd",
  "Shyam Metalics and Energy Ltd",
  "Kalyani Steels Limited",
  "Sunflag Iron and Steel Company Limited",
  "Sarda Energy & Minerals Ltd",
  "Jayaswal Neco Industries Ltd",
  "Jai Balaji Industries Ltd",
  "Welspun Corp Ltd",
  "Tube Investments of India Ltd",
  "APL Apollo Tubes Ltd",
  "Ratnamani Metals & Tubes Ltd",
  "Kirloskar Ferrous Industries Ltd",
  "Nava Limited",
  "Godawari Power & Ispat Ltd",
  "Bhushan Power & Steel Ltd",
  "Usha Martin Ltd",
  "Visa Steel Ltd",
  "Maharashtra Seamless Ltd",
  "Prakash Industries Ltd",
  "Maithan Alloys Ltd",
  "MESCO Steel",
]

const MILLS = [
  "Blast Furnace",
  "Steel Melting",
  "Sinter Plant",
  "Rail & Structural Mill",
  "Universal Rail Mill",
  "Plate Mill",
  "Bar & Rod Mill",
  "Merchant Mill",
  "Wire Rod Mill",
  "Coke Oven Battery",
  "Power Plants",
  "Oxygen Plants",
  "Refractory Materials Plant",
  "Foundry & Engineering Shops",
  "Coal Chemicals Units",
  "Slag Granulation Plants",
  "Raw Material Preparation Plants",
]

interface Order {
  id: string
  orderNumber: string
  destination: string
  materialCode: string
  party: string
  mill: string
  priority: number
  materialDescription: string
  orderQuantity: number
  validUntil: Date
}

interface EditOrderDialogProps {
  order: Order
}

export function EditOrderDialog({ order }: EditOrderDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    destination: order.destination,
    materialCode: order.materialCode,
    party: order.party,
    mill: order.mill,
    priority: order.priority.toString(),
    materialDescription: order.materialDescription,
    orderQuantity: order.orderQuantity.toString(),
    validUntil: new Date(order.validUntil).toISOString().split("T")[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          priority: Number.parseInt(formData.priority),
          orderQuantity: Number.parseInt(formData.orderQuantity),
          validUntil: new Date(formData.validUntil),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order updated successfully!",
        })
        setOpen(false)
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>Update the order details. Order #{order.orderNumber}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Select
                onValueChange={(value) => handleChange("destination", value)}
                value={formData.destination}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {DESTINATIONS.map((destination) => (
                    <SelectItem key={destination} value={destination}>
                      {destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="materialCode">Material Code</Label>
              <Input
                id="materialCode"
                value={formData.materialCode}
                onChange={(e) => handleChange("materialCode", e.target.value)}
                placeholder="e.g., MAT001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="party">Party</Label>
              <Input
                id="party"
                value={formData.party}
                onChange={(e) => handleChange("party", e.target.value)}
                placeholder="Enter party name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mill">Mill</Label>
              <Select onValueChange={(value) => handleChange("mill", value)} value={formData.mill} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select mill" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {MILLS.map((mill) => (
                    <SelectItem key={mill} value={mill}>
                      {mill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority (1-2000)</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="2000"
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                placeholder="Enter priority"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderQuantity">Order Quantity</Label>
              <Input
                id="orderQuantity"
                type="number"
                min="1"
                value={formData.orderQuantity}
                onChange={(e) => handleChange("orderQuantity", e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input
              id="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleChange("validUntil", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialDescription">Material Description</Label>
            <Textarea
              id="materialDescription"
              value={formData.materialDescription}
              onChange={(e) => handleChange("materialDescription", e.target.value)}
              placeholder="Describe the material requirements..."
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
