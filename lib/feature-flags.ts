"use client"

import { createBrowserClient } from "@supabase/ssr"

interface FeatureFlag {
  id: string
  name: string
  key: string
  is_enabled: boolean
  rollout_percentage: number
  target_audience: string
  environment: string
}

class FeatureFlagService {
  private flags: Map<string, FeatureFlag> = new Map()
  private supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  async loadFlags(environment = "production") {
    try {
      const { data: flags, error } = await this.supabase
        .from("feature_flags")
        .select("*")
        .eq("environment", environment)

      if (error) throw error

      this.flags.clear()
      flags?.forEach((flag) => {
        this.flags.set(flag.key, flag)
      })
    } catch (error) {
      console.error("Failed to load feature flags:", error)
    }
  }

  isEnabled(key: string, userContext?: { isVip?: boolean; isAdmin?: boolean; userId?: string }): boolean {
    const flag = this.flags.get(key)
    if (!flag) return false

    // Check if flag is globally disabled
    if (!flag.is_enabled) return false

    // Check target audience
    if (flag.target_audience === "vip" && !userContext?.isVip) return false
    if (flag.target_audience === "admin" && !userContext?.isAdmin) return false

    // Check rollout percentage
    if (flag.rollout_percentage < 100) {
      // Use user ID for consistent rollout (same user always gets same result)
      const userId = userContext?.userId || "anonymous"
      const hash = this.simpleHash(userId + flag.key)
      const userPercentile = hash % 100
      return userPercentile < flag.rollout_percentage
    }

    return true
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Convenience methods for specific flags
  isSnipToCartEnabled(userContext?: any): boolean {
    return this.isEnabled("snip-to-cart", userContext)
  }

  isDryingRoomOverlaysEnabled(userContext?: any): boolean {
    return this.isEnabled("drying-room-overlays", userContext)
  }

  isGrowLightTabsEnabled(userContext?: any): boolean {
    return this.isEnabled("grow-light-tabs", userContext)
  }

  isVipEarlyAccessEnabled(userContext?: any): boolean {
    return this.isEnabled("vip-early-access", userContext)
  }

  isDynamicPricingEnabled(userContext?: any): boolean {
    return this.isEnabled("dynamic-pricing", userContext)
  }

  isQueueSystemEnabled(userContext?: any): boolean {
    return this.isEnabled("queue-system", userContext)
  }

  isStrainInfoEnabled(userContext?: any): boolean {
    return this.isEnabled("strain-info", userContext)
  }

  isMacroPhotographyEnabled(userContext?: any): boolean {
    return this.isEnabled("macro-photography", userContext)
  }
}

export const featureFlags = new FeatureFlagService()

// React hook for using feature flags
export function useFeatureFlag(key: string, userContext?: { isVip?: boolean; isAdmin?: boolean; userId?: string }) {
  return featureFlags.isEnabled(key, userContext)
}
