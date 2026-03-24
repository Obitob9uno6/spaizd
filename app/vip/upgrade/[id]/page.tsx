import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Check, Crown, Zap, Clock, ShoppingBag, Star, ArrowLeft, ArrowRight } from "lucide-react"

interface VIPUpgradePageProps {
  params: { id: string }
}

export default async function VIPUpgradePage({ params }: VIPUpgradePageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/vip/upgrade/${params.id}`)
  }

  // Get the target tier
  const { data: targetTier, error } = await supabase.from("vip_tiers").select("*").eq("id", params.id).single()

  if (error || !targetTier) {
    notFound()
  }

  // Get user's current membership
  const { data: currentMembership } = await supabase
    .from("vip_memberships")
    .select("*, tier:vip_tiers(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (!currentMembership) {
    redirect(`/vip/join/${params.id}`)
  }

  if (currentMembership.tier.id === targetTier.id) {
    redirect("/vip/dashboard")
  }

  const priceDiffCents = targetTier.price_cents - currentMembership.tier.price_cents

  const getTierIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "gold":
        return <Crown className="w-6 h-6 text-yellow-500" />
      case "platinum":
        return <Star className="w-6 h-6 text-gray-400" />
      case "diamond":
        return <Zap className="w-6 h-6 text-blue-400" />
      default:
        return <Crown className="w-6 h-6" />
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Link href="/vip/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to my dashboard
        </Link>

        <Card className="border">
          <CardHeader className="text-center space-y-4">
            <Badge className="mx-auto bg-accent text-accent-foreground">
              <Crown className="w-3 h-3 mr-1" />
              Upgrade Membership
            </Badge>
            <CardTitle className="text-2xl">Upgrade to {targetTier.name}</CardTitle>
            <CardDescription>
              You are upgrading from <strong>{currentMembership.tier.name}</strong> to{" "}
              <strong>{targetTier.name}</strong>. Your benefits will upgrade immediately.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tier comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-2">{getTierIcon(currentMembership.tier.name)}</div>
                <p className="text-sm text-muted-foreground">Current</p>
                <p className="font-semibold">{currentMembership.tier.name}</p>
                <p className="text-sm">${(currentMembership.tier.price_cents / 100).toFixed(0)}/yr</p>
              </div>
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-2">{getTierIcon(targetTier.name)}</div>
                <p className="text-sm text-muted-foreground">Upgrading to</p>
                <p className="font-semibold text-accent">{targetTier.name}</p>
                <p className="text-sm">${(targetTier.price_cents / 100).toFixed(0)}/yr</p>
              </div>
            </div>

            {/* New benefits gained */}
            <div className="space-y-3 bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Your new {targetTier.name} benefits
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {targetTier.early_access_hours}h early access (up from {currentMembership.tier.early_access_hours}h)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">
                    <ShoppingBag className="w-4 h-4 inline mr-1" />
                    {targetTier.discount_percent}% off all purchases (up from {currentMembership.tier.discount_percent}%)
                  </span>
                </div>
                {targetTier.free_shipping && !currentMembership.tier.free_shipping && (
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-sm">Free shipping on every order (new benefit)</span>
                  </div>
                )}
                {targetTier.exclusive_drops && !currentMembership.tier.exclusive_drops && (
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-sm">Access to VIP-only exclusive drops (new benefit)</span>
                  </div>
                )}
                {targetTier.name.toLowerCase() === "diamond" && (
                  <>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="text-sm">Personal shopping concierge</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="text-sm">Exclusive events & meetups</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Price difference */}
            {priceDiffCents > 0 && (
              <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                <span className="text-sm text-muted-foreground">Upgrade cost (prorated)</span>
                <span className="font-bold text-lg">+${(priceDiffCents / 100).toFixed(0)}</span>
              </div>
            )}

            {/* CTA */}
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" asChild>
              <Link href={`/vip/checkout/${targetTier.id}?upgrade=true`}>
                Upgrade to {targetTier.name}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Benefits activate immediately upon upgrade. Remaining value from your current plan will be credited.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
