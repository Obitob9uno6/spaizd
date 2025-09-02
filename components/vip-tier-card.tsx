"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Clock, ShoppingBag, Star } from "lucide-react"
import Link from "next/link"

interface VIPTier {
  id: string
  name: string
  price_cents: number
  early_access_hours: number
  discount_percent: number
  free_shipping: boolean
  exclusive_drops: boolean
}

interface VIPMembership {
  tier: VIPTier
  status: string
  expires_at: string
}

interface VIPTierCardProps {
  tier: VIPTier
  isPopular?: boolean
  currentMembership: VIPMembership | null
  user: any
}

export function VIPTierCard({ tier, isPopular, currentMembership, user }: VIPTierCardProps) {
  const isCurrentTier = currentMembership?.tier.id === tier.id
  const canUpgrade = currentMembership && currentMembership.tier.price_cents < tier.price_cents

  const getTierIcon = () => {
    switch (tier.name.toLowerCase()) {
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

  const getTierColor = () => {
    switch (tier.name.toLowerCase()) {
      case "gold":
        return "border-yellow-500/20 bg-yellow-500/5"
      case "platinum":
        return "border-gray-400/20 bg-gray-400/5"
      case "diamond":
        return "border-blue-400/20 bg-blue-400/5"
      default:
        return ""
    }
  }

  const getActionButton = () => {
    if (!user) {
      return (
        <Link href="/auth/sign-up" className="w-full">
          <Button className="w-full">Sign Up to Join</Button>
        </Link>
      )
    }

    if (isCurrentTier) {
      return (
        <Button variant="outline" disabled className="w-full bg-transparent">
          <Check className="w-4 h-4 mr-2" />
          Current Plan
        </Button>
      )
    }

    if (canUpgrade) {
      return (
        <Link href={`/vip/upgrade/${tier.id}`} className="w-full">
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Upgrade to {tier.name}</Button>
        </Link>
      )
    }

    return (
      <Link href={`/vip/join/${tier.id}`} className="w-full">
        <Button className="w-full">Join {tier.name}</Button>
      </Link>
    )
  }

  return (
    <Card className={`relative ${getTierColor()} ${isPopular ? "ring-2 ring-accent" : ""}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">{getTierIcon()}</div>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <div className="text-3xl font-bold">
          ${(tier.price_cents / 100).toFixed(0)}
          <span className="text-sm font-normal text-muted-foreground">/year</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Check className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              {tier.early_access_hours}h early access to drops
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
              <span className="text-sm">Free shipping on all orders</span>
            </div>
          )}

          {tier.exclusive_drops && (
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-secondary flex-shrink-0" />
              <span className="text-sm">
                <Zap className="w-4 h-4 inline mr-1" />
                Access to VIP-only drops
              </span>
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

        {getActionButton()}

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {tier.free_shipping && tier.discount_percent >= 15
              ? "Membership pays for itself with just 2-3 purchases"
              : "Cancel anytime, benefits active until expiration"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
