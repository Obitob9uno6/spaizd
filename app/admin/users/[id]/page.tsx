import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Crown, ShoppingBag, Mail, Phone, Calendar, Shield } from "lucide-react"
import Link from "next/link"
import { UserRoleUpdater } from "@/components/admin/user-role-updater"

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch user profile data
  const { data: user } = await supabase
    .from("profiles")
    .select(`
      *,
      vip_memberships (
        *,
        vip_tiers (*)
      ),
      orders (
        *,
        order_items (
          *,
          products (name, image_url)
        )
      ),
      wishlists (
        *,
        products (name, image_url)
      )
    `)
    .eq("id", params.id)
    .single()

  if (!user) {
    notFound()
  }

  // Get role information
  const { data: roleData } = await supabase.from("user_profiles").select("role").eq("id", params.id).single()

  const userRole = roleData?.role || "customer"

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-amber-glow text-black"
      case "admin":
        return "bg-bud-purple text-white"
      case "customer":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const activeVip = user.vip_memberships?.find((membership: any) => membership.status === "active")
  const totalSpent = user.orders?.reduce((sum: number, order: any) => sum + order.total_cents, 0) || 0
  const totalOrders = user.orders?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {user.display_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User Profile"}
            </h1>
            <p className="text-gray-400 mt-1">Member since {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getRoleColor(userRole)} size="lg">
            <Shield className="h-3 w-3 mr-1" />
            {userRole}
          </Badge>
          {activeVip && (
            <Badge className="bg-amber-glow text-black" size="lg">
              <Crown className="h-3 w-3 mr-1" />
              {activeVip.vip_tiers.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-led-green" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{user.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{user.phone || "Not provided"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">First Name</label>
                  <p className="text-white mt-1">{user.first_name || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Last Name</label>
                  <p className="text-white mt-1">{user.last_name || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Display Name</label>
                  <p className="text-white mt-1">{user.display_name || "Not set"}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Date of Birth</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-white">
                      {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-led-green" />
                Order History ({totalOrders} orders)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-4">
                  {user.orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.created_at).toLocaleDateString()} • {order.order_items?.length || 0} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${(order.total_cents / 100).toFixed(2)}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {user.orders.length > 5 && (
                    <p className="text-gray-400 text-sm text-center">And {user.orders.length - 5} more orders...</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No orders yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Summary */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Orders</span>
                  <span className="text-white font-medium">{totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Spent</span>
                  <span className="text-white font-medium">${(totalSpent / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wishlist Items</span>
                  <span className="text-white font-medium">{user.wishlists?.length || 0}</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Status</span>
                  <Badge className="bg-led-green text-black">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VIP Membership */}
          {activeVip && (
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-glow" />
                  VIP Membership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-amber-glow font-semibold">{activeVip.vip_tiers.name} Member</h3>
                  <p className="text-gray-400 text-sm">Expires {new Date(activeVip.expires_at).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-white">{activeVip.vip_tiers.discount_percent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Early Access</span>
                    <span className="text-white">{activeVip.vip_tiers.early_access_hours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Free Shipping</span>
                    <span className="text-white">{activeVip.vip_tiers.free_shipping ? "Yes" : "No"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Role Management */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <UserRoleUpdater userId={user.id} currentRole={userRole} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
