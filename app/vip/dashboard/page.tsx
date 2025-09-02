import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VIPDashboard } from "@/components/vip-dashboard"

export default async function VIPDashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's VIP membership
  const { data: membership } = await supabase
    .from("vip_memberships")
    .select(`
      *,
      tier:vip_tiers(*)
    `)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (!membership) {
    redirect("/vip")
  }

  // Get upcoming VIP-accessible drops
  const { data: upcomingDrops } = await supabase
    .from("drops")
    .select(`
      *,
      drop_products(
        *,
        product:products(*),
        variant:product_variants(*)
      )
    `)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(3)

  // Get user's recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        product:products(*),
        variant:product_variants(*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <VIPDashboard
        user={user}
        membership={membership}
        upcomingDrops={upcomingDrops || []}
        recentOrders={recentOrders || []}
      />
    </div>
  )
}
