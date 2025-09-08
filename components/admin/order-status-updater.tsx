"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

interface OrderStatusUpdaterProps {
  orderId: string
  currentStatus: string
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleUpdateOrder = async () => {
    setLoading(true)
    try {
      const updateData: any = { status }

      if (trackingNumber) {
        updateData.tracking_number = trackingNumber
      }

      if (notes) {
        updateData.notes = notes
      }

      const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

      if (error) throw error

      router.refresh()
      alert("Order updated successfully!")
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Failed to update order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="status" className="text-gray-300">
          Order Status
        </Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tracking" className="text-gray-300">
          Tracking Number
        </Label>
        <Input
          id="tracking"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
          className="bg-gray-800 border-gray-600 text-white"
        />
      </div>

      <div>
        <Label htmlFor="notes" className="text-gray-300">
          Notes
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this order..."
          className="bg-gray-800 border-gray-600 text-white"
          rows={3}
        />
      </div>

      <Button onClick={handleUpdateOrder} disabled={loading} className="w-full bg-bud-purple hover:bg-bud-purple/80">
        {loading ? "Updating..." : "Update Order"}
      </Button>
    </div>
  )
}
