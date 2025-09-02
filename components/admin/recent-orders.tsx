import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye } from "lucide-react"

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  user_profiles?: {
    email: string
    full_name: string
  }
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-led-green text-black"
      case "processing":
        return "bg-harvest-gold text-black"
      case "shipped":
        return "bg-blue-500 text-white"
      case "delivered":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No recent orders</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-white font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-gray-400 text-sm">
                  {order.user_profiles?.full_name || order.user_profiles?.email || "Guest"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white font-medium">${order.total_amount.toFixed(2)}</p>
              <Badge className={getStatusColor(order.status)} size="sm">
                {order.status}
              </Badge>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/orders/${order.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
