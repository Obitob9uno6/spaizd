import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrdersTable } from "@/components/admin/orders-table"
import { OrdersStats } from "@/components/admin/orders-stats"
import { ShoppingCart, TrendingUp, Clock, CheckCircle } from "lucide-react"

export default async function AdminOrdersPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch orders with user and item details
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      user_profiles (email, full_name),
      order_items (
        *,
        products (name, image_url)
      )
    `)
    .order("created_at", { ascending: false })

  // Calculate order statistics
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
  const processingOrders = orders?.filter((order) => order.status === "processing").length || 0
  const completedOrders = orders?.filter((order) => order.status === "delivered").length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      icon: Clock,
      trend: "-5.1%",
      trendUp: false,
    },
    {
      title: "Completed Orders",
      value: completedOrders.toString(),
      icon: CheckCircle,
      trend: "+15.3%",
      trendUp: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Orders Management</h1>
        <p className="text-gray-400 mt-2">Manage and track all customer orders</p>
      </div>

      {/* Orders Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <OrdersStats
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
          />
        ))}
      </div>

      {/* Orders Table */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-led-green" />
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders || []} />
        </CardContent>
      </Card>
    </div>
  )
}
