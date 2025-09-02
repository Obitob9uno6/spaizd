import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountDashboard } from "@/components/account-dashboard"

export default async function AccountPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get VIP membership if exists
  const { data: membership } = await supabase
    .from("vip_memberships")
    .select(`
      *,
      tier:vip_tiers(*)
    `)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  // Get recent orders
  const { data: orders } = await supabase
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
    .limit(10)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AccountDashboard user={user} profile={profile} membership={membership} orders={orders || []} />
    </div>
  )
}
