import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, TrendingUp, DollarSign } from "lucide-react"

export default async function AdminVIPPage() {
  const supabase = await createClient()

  // Fetch all VIP memberships with user and tier info
  const { data: memberships } = await supabase
    .from("vip_memberships")
    .select(`
      *,
      tier:vip_tiers(name, price_cents, discount_percent, early_access_hours),
      profile:profiles(email, first_name, last_name)
    `)
    .order("created_at", { ascending: false })

  // Fetch tier stats
  const { data: tiers } = await supabase
    .from("vip_tiers")
    .select("id, name, price_cents")
    .order("price_cents", { ascending: true })

  const activeMemberships = memberships?.filter((m) => m.status === "active") || []
  const totalRevenue = activeMemberships.reduce((sum, m) => sum + (m.tier?.price_cents || 0), 0) / 100

  const tierCounts = tiers?.map((tier) => ({
    ...tier,
    count: activeMemberships.filter((m) => m.tier?.name === tier.name).length,
  })) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "expired":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTierColor = (name: string) => {
    switch (name?.toLowerCase()) {
      case "gold":
        return "text-yellow-400"
      case "platinum":
        return "text-gray-300"
      case "diamond":
        return "text-blue-400"
      default:
        return "text-trichome-frost"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-trichome-frost">VIP Members</h1>
        <p className="text-gray-400 mt-2">Manage VIP memberships and subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-cosmic-black border-amber-glow/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Members</p>
                <p className="text-2xl font-bold text-trichome-frost">{activeMemberships.length}</p>
              </div>
              <Crown className="h-8 w-8 text-amber-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-leaf-green/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Annual Revenue</p>
                <p className="text-2xl font-bold text-trichome-frost">${totalRevenue.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-leaf-green" />
            </div>
          </CardContent>
        </Card>

        {tierCounts.slice(0, 2).map((tier) => (
          <Card key={tier.id} className="bg-cosmic-black border-bud-purple/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{tier.name} Members</p>
                  <p className={`text-2xl font-bold ${getTierColor(tier.name)}`}>{tier.count}</p>
                </div>
                <Users className="h-8 w-8 text-bud-purple" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tier breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tierCounts.map((tier) => (
          <Card key={tier.id} className="bg-cosmic-black border-bud-purple/20">
            <CardHeader className="pb-2">
              <CardTitle className={`flex items-center gap-2 ${getTierColor(tier.name)}`}>
                <Crown className="h-5 w-5" />
                {tier.name} Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Members</span>
                <span className="text-trichome-frost font-medium">{tier.count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Annual Price</span>
                <span className="text-trichome-frost font-medium">${(tier.price_cents / 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tier Revenue</span>
                <span className="text-leaf-green font-medium">
                  ${((tier.price_cents / 100) * tier.count).toFixed(0)}/yr
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members Table */}
      <Card className="bg-cosmic-black border-bud-purple/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-glow" />
            All VIP Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!memberships || memberships.length === 0 ? (
            <div className="text-center py-12">
              <Crown className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No VIP members yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bud-purple/20">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Member</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Tier</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Expires</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bud-purple/10">
                  {memberships.map((membership) => (
                    <tr key={membership.id} className="hover:bg-bud-purple/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-trichome-frost font-medium">
                            {membership.profile?.first_name || membership.profile?.last_name
                              ? `${membership.profile.first_name || ""} ${membership.profile.last_name || ""}`.trim()
                              : "Unknown"}
                          </p>
                          <p className="text-gray-400 text-xs">{membership.profile?.email || "—"}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getTierColor(membership.tier?.name || "")}`}>
                          {membership.tier?.name || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${getStatusColor(membership.status)}`}
                        >
                          {membership.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(membership.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {membership.expires_at
                          ? new Date(membership.expires_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-leaf-green font-medium">
                        ${((membership.tier?.price_cents || 0) / 100).toFixed(0)}/yr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
