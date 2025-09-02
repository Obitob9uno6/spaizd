"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CountdownTimer } from "@/components/countdown-timer"
import Link from "next/link"
import { Crown, Clock, ShoppingBag, Zap, Calendar, TrendingUp, Gift } from "lucide-react"

interface VIPDashboardProps {
  user: any
  membership: any
  upcomingDrops: any[]
  recentOrders: any[]
}

export function VIPDashboard({ user, membership, upcomingDrops, recentOrders }: VIPDashboardProps) {
  const membershipExpiry = new Date(membership.expires_at)
  const daysUntilExpiry = Math.ceil((membershipExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  // Calculate savings this year (mock data for demo)
  const totalSavings = 247.5
  const ordersThisYear = recentOrders.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">VIP Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.email}</p>
        </div>
        <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2">
          <Crown className="w-5 h-5 mr-2" />
          {membership.tier.name} Member
        </Badge>
      </div>

      {/* Membership Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{membership.tier.name}</div>
            <p className="text-xs text-muted-foreground">
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : "Expired"}
            </p>
            <div className="mt-2">
              <Progress value={Math.max(0, Math.min(100, (daysUntilExpiry / 365) * 100))} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">${totalSavings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This year with member pricing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders This Year</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{ordersThisYear}</div>
            <p className="text-xs text-muted-foreground">
              {membership.tier.free_shipping ? "All with free shipping" : "Member discounts applied"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Early Access Drops */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Early Access Drops
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingDrops.length > 0 ? (
            <div className="space-y-4">
              {upcomingDrops.map((drop) => {
                const vipStartTime = new Date(
                  new Date(drop.start_time).getTime() - membership.tier.early_access_hours * 60 * 60 * 1000,
                )
                const isVipAccessActive = new Date() >= vipStartTime && new Date() < new Date(drop.start_time)

                return (
                  <div key={drop.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-card rounded-lg overflow-hidden">
                        <img
                          src={
                            drop.images[0] ||
                            "/placeholder.svg?height=64&width=64&query=cannabis streetwear drop" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={drop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{drop.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {drop.drop_products.length} items • Starting at $
                          {Math.min(...drop.drop_products.map((dp: any) => dp.drop_price_cents / 100)).toFixed(2)}
                        </p>
                        {isVipAccessActive && (
                          <Badge className="bg-secondary text-secondary-foreground mt-1">
                            <Zap className="w-3 h-3 mr-1" />
                            VIP Access Live
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {isVipAccessActive ? (
                        <Link href={`/drops/${drop.slug}`}>
                          <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                            Shop Now
                          </Button>
                        </Link>
                      ) : (
                        <div className="text-sm">
                          <p className="text-muted-foreground">VIP access in:</p>
                          <CountdownTimer targetDate={vipStartTime.toISOString()} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming drops at the moment</p>
              <p className="text-sm text-muted-foreground">Check back soon for exclusive early access</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Your Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Early Access</span>
              <Badge variant="outline">{membership.tier.early_access_hours}h before public</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Member Discount</span>
              <Badge variant="outline">{membership.tier.discount_percent}% off all items</Badge>
            </div>
            {membership.tier.free_shipping && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Free Shipping</span>
                <Badge variant="outline">All orders</Badge>
              </div>
            )}
            {membership.tier.exclusive_drops && (
              <div className="flex items-center justify-between">
                <span className="text-sm">VIP-Only Drops</span>
                <Badge variant="outline">Exclusive access</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Order #{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${(order.total_cents / 100).toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link href="/account/orders">
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                    View All Orders
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/drops">
              <Button variant="outline" className="w-full bg-transparent">
                <Clock className="w-4 h-4 mr-2" />
                View Drops
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" className="w-full bg-transparent">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop All
              </Button>
            </Link>
            <Link href="/vip">
              <Button variant="outline" className="w-full bg-transparent">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Tier
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="outline" className="w-full bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
