import { createClient } from "@/lib/supabase/server"
import { VIPTierCard } from "@/components/vip-tier-card"
import { VIPBenefits } from "@/components/vip-benefits"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Crown, Star } from "lucide-react"

export default async function VIPPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get VIP tiers
  const { data: vipTiers } = await supabase.from("vip_tiers").select("*").order("price_cents", { ascending: true })

  // Get user's current VIP status if logged in
  let currentMembership = null
  if (user) {
    const { data: membership } = await supabase
      .from("vip_memberships")
      .select(`
        *,
        tier:vip_tiers(*)
      `)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    currentMembership = membership
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-6 bg-accent text-accent-foreground">
          <Crown className="w-4 h-4 mr-2" />
          VIP Exclusive
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Join the
          <span className="text-accent block">Inner Circle</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
          Get exclusive access to limited drops, member-only pricing, and premium benefits. Be part of the community
          that gets first dibs on everything Grow Spaizd.
        </p>

        {currentMembership && (
          <div className="mb-8">
            <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-2">
              <Crown className="w-5 h-5 mr-2" />
              Current Member: {currentMembership.tier.name}
            </Badge>
          </div>
        )}

        {!user && (
          <div className="mb-8">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Account to Join VIP
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Benefits Overview */}
      <VIPBenefits />

      {/* VIP Tiers */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Tier</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each tier offers increasing levels of access and benefits. Upgrade anytime to unlock more exclusive
            features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vipTiers?.map((tier, index) => (
            <VIPTierCard
              key={tier.id}
              tier={tier}
              isPopular={index === 1}
              currentMembership={currentMembership}
              user={user}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What VIP Members Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-muted-foreground mb-4">
              "The early access is game-changing. I never miss out on limited drops anymore, and the member pricing
              saves me so much money."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-secondary-foreground">MJ</span>
              </div>
              <div>
                <p className="font-medium text-sm">Mike J.</p>
                <p className="text-xs text-muted-foreground">Platinum Member</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-muted-foreground mb-4">
              "The exclusive colorways and VIP-only drops are incredible. You really feel like part of something
              special."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-secondary-foreground">SK</span>
              </div>
              <div>
                <p className="font-medium text-sm">Sarah K.</p>
                <p className="text-xs text-muted-foreground">Diamond Member</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-muted-foreground mb-4">
              "Free shipping and member discounts pay for the membership itself. Plus the community is amazing."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-secondary-foreground">AL</span>
              </div>
              <div>
                <p className="font-medium text-sm">Alex L.</p>
                <p className="text-xs text-muted-foreground">Gold Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">How does early access work?</h3>
            <p className="text-muted-foreground text-sm">
              VIP members get exclusive access to drops 24-72 hours before public release, depending on your tier.
              You'll receive email notifications when early access begins.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Can I upgrade my membership tier?</h3>
            <p className="text-muted-foreground text-sm">
              Yes! You can upgrade to a higher tier at any time. You'll only pay the difference, and your benefits
              upgrade immediately.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">What happens if I cancel my membership?</h3>
            <p className="text-muted-foreground text-sm">
              Your membership remains active until the end of your billing period. You'll keep all benefits until
              expiration, but won't be charged again.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Are VIP-only products really exclusive?</h3>
            <p className="text-muted-foreground text-sm">
              Absolutely. VIP-only colorways and designs are never released to the public. They're created specifically
              for our VIP community.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
