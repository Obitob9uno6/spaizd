import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Check, Crown, Zap, Clock, ShoppingBag, Star, ArrowLeft } from "lucide-react"

interface VIPJoinPageProps {
  params: { id: string }
}

export default async function VIPJoinPage({ params }: VIPJoinPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/sign-up?redirect=/vip/join/${params.id}`)
  }

  // Get the tier
  const { data: tier, error } = await supabase.from("vip_tiers").select("*").eq("id", params.id).single()

  if (error || !tier) {
    notFound()
  }

  // Check if user already has an active membership
  const { data: existingMembership } = await supabase
    .from("vip_memberships")
    .select("*, tier:vip_tiers(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (existingMembership) {
    // Already a member — send to upgrade if applicable, or dashboard
    if (existingMembership.tier.id === tier.id) {
      redirect("/vip/dashboard")
    }
    redirect(`/vip/upgrade/${tier.id}`)
  }

  const getTierIcon = () => {
    switch (tier.name.toLowerCase()) {
      case "gold":
        return <Crown className="w-8 h-8 text-yellow-500" />
      case "platinum":
        return <Star className="w-8 h-8 text-gray-400" />
      case "diamond":
        return <Zap className="w-8 h-8 text-blue-400" />
      default:
        return <Crown className="w-8 h-8" />
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Link href="/vip" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to VIP tiers
        </Link>

        <Card className="border">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">{getTierIcon()}</div>
            <div>
              <Badge className="mb-2 bg-accent text-accent-foreground">
                <Crown className="w-3 h-3 mr-1" />
                VIP Membership
              </Badge>
              <CardTitle className="text-3xl">{tier.name} Tier</CardTitle>
              <CardDescription className="text-base mt-2">
                Join the inner circle and unlock exclusive benefits
              </CardDescription>
            </div>
            <div className="text-4xl font-bold">
              ${(tier.price_cents / 100).toFixed(0)}
              <span className="text-base font-normal text-muted-foreground">/year</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Benefits */}
            <div className="space-y-3 bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Included benefits</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {tier.early_access_hours}h early access to every drop
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">
                    <ShoppingBag className="w-4 h-4 inline mr-1" />
                    {tier.discount_percent}% off all purchases
                  </span>
                </div>
                {tier.free_shipping && (
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-sm">Free shipping on every order</span>
                  </div>
                )}
                {tier.exclusive_drops && (
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-sm">Access to VIP-only exclusive drops</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">Priority customer support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">Member-only community access</span>
                </div>
                {tier.name.toLowerCase() === "diamond" && (
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

            {/* Payment notice */}
            <div className="text-center text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">
              Membership billed annually. Cancel anytime — benefits stay active until expiration.
            </div>

            {/* CTA */}
            <Button className="w-full" size="lg" asChild>
              <Link href={`/vip/checkout/${tier.id}`}>
                Join {tier.name} — ${(tier.price_cents / 100).toFixed(0)}/yr
              </Link>
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By continuing you agree to our{" "}
              <Link href="/legal/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
