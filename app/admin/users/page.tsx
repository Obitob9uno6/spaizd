import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/components/admin/users-table"
import { UsersStats } from "@/components/admin/users-stats"
import { Users, UserPlus, Crown, Shield } from "lucide-react"

export default async function AdminUsersPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch users with profile data and VIP memberships
  const { data: users } = await supabase
    .from("profiles")
    .select(`
      *,
      vip_memberships (
        status,
        expires_at,
        vip_tiers (name, discount_percent)
      ),
      orders (id, total_cents, status, created_at)
    `)
    .order("created_at", { ascending: false })

  // Add role information from user_profiles table if it exists
  const { data: userRoles } = await supabase.from("user_profiles").select("id, role")

  // Merge role data with user profiles
  const usersWithRoles =
    users?.map((user) => {
      const roleData = userRoles?.find((role) => role.id === user.id)
      return {
        ...user,
        role: roleData?.role || "customer",
      }
    }) || []

  // Calculate user statistics
  const totalUsers = usersWithRoles.length
  const adminUsers = usersWithRoles.filter((user) => user.role === "admin" || user.role === "owner").length
  const vipUsers = usersWithRoles.filter(
    (user) =>
      user.vip_memberships &&
      user.vip_memberships.length > 0 &&
      user.vip_memberships.some((membership: any) => membership.status === "active"),
  ).length
  const newUsersThisMonth = usersWithRoles.filter((user) => {
    const userDate = new Date(user.created_at)
    const now = new Date()
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
    return userDate >= monthAgo
  }).length

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "New This Month",
      value: newUsersThisMonth.toString(),
      icon: UserPlus,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "VIP Members",
      value: vipUsers.toString(),
      icon: Crown,
      trend: "+15.3%",
      trendUp: true,
    },
    {
      title: "Admin Users",
      value: adminUsers.toString(),
      icon: Shield,
      trend: "0%",
      trendUp: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 mt-2">Manage customer accounts, roles, and memberships</p>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <UsersStats
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
          />
        ))}
      </div>

      {/* Users Table */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-led-green" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={usersWithRoles} />
        </CardContent>
      </Card>
    </div>
  )
}
