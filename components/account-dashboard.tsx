"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { User, Crown, ShoppingBag, Settings, LogOut, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AccountDashboardProps {
  user: any
  profile: any
  membership: any
  orders: any[]
}

export function AccountDashboard({ user, profile, membership, orders }: AccountDashboardProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and orders</p>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="bg-transparent">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Member since {new Date(user.created_at).getFullYear()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Status</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {membership ? (
              <>
                <div className="text-2xl font-bold text-accent">{membership.tier.name}</div>
                <p className="text-xs text-muted-foreground">
                  Expires {new Date(membership.expires_at).toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">None</div>
                <Link href="/vip" className="text-xs text-secondary hover:underline">
                  Join VIP
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              ${orders.reduce((sum, order) => sum + order.total_cents / 100, 0).toFixed(2)} total spent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-sm">
                {profile?.first_name || profile?.last_name
                  ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                  : "Not provided"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* VIP Membership */}
      {membership && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              VIP Membership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{membership.tier.name} Member</h3>
                <p className="text-sm text-muted-foreground">
                  Expires on {new Date(membership.expires_at).toLocaleDateString()}
                </p>
              </div>
              <Badge className="bg-accent text-accent-foreground">Active</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Early Access</p>
                <p className="font-medium">{membership.tier.early_access_hours}h</p>
              </div>
              <div>
                <p className="text-muted-foreground">Discount</p>
                <p className="font-medium">{membership.tier.discount_percent}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Free Shipping</p>
                <p className="font-medium">{membership.tier.free_shipping ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">VIP Drops</p>
                <p className="font-medium">{membership.tier.exclusive_drops ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href="/vip/dashboard">
                <Button variant="outline" size="sm" className="bg-transparent">
                  VIP Dashboard
                </Button>
              </Link>
              <Link href="/vip">
                <Button variant="outline" size="sm" className="bg-transparent">
                  Upgrade Tier
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-semibold">Order #{order.order_number}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()} • {order.order_items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(order.total_cents / 100).toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length > 5 && (
                <Button variant="outline" className="w-full bg-transparent">
                  View All Orders
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/shop">
              <Button variant="outline" className="w-full bg-transparent">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
            </Link>
            <Link href="/drops">
              <Button variant="outline" className="w-full bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                View Drops
              </Button>
            </Link>
            {!membership && (
              <Link href="/vip">
                <Button variant="outline" className="w-full bg-transparent">
                  <Crown className="w-4 h-4 mr-2" />
                  Join VIP
                </Button>
              </Link>
            )}
            {membership && (
              <Link href="/vip/dashboard">
                <Button variant="outline" className="w-full bg-transparent">
                  <Crown className="w-4 h-4 mr-2" />
                  VIP Dashboard
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
