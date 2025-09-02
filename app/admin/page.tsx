import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ShoppingCart, DollarSign, Zap } from "lucide-react"
import { AdminStatsCard } from "@/components/admin/admin-stats-card"
import { RecentOrders } from "@/components/admin/recent-orders"
import { DropStatus } from "@/components/admin/drop-status"

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch dashboard stats
  const [
    { count: totalProducts },
    { count: totalUsers },
    { count: totalOrders },
    { data: recentOrders },
    { data: activeDrops },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select(`
        *,
        user_profiles (email, full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("drops").select("*").eq("status", "active").order("start_time", { ascending: true }).limit(3),
  ])

  // Calculate total revenue
  const { data: revenueData } = await supabase.from("orders").select("total_amount").eq("payment_status", "paid")

  const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend="+12.5%"
          trendUp={true}
        />
        <AdminStatsCard
          title="Total Orders"
          value={totalOrders?.toString() || "0"}
          icon={ShoppingCart}
          trend="+8.2%"
          trendUp={true}
        />
        <AdminStatsCard
          title="Total Users"
          value={totalUsers?.toString() || "0"}
          icon={Users}
          trend="+15.3%"
          trendUp={true}
        />
        <AdminStatsCard
          title="Products"
          value={totalProducts?.toString() || "0"}
          icon={Package}
          trend="+2"
          trendUp={true}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-led-green" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={recentOrders || []} />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-harvest-gold" />
              Active Drops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DropStatus drops={activeDrops || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
