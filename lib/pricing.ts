// Automated pricing engine utilities

export interface PricingRule {
  product_type: string
  tier: string
  base_cost_cents: number
  markup_multiplier: number
  min_price_cents?: number
  max_price_cents?: number
  dynamic_adjustment: boolean
  adjustment_trigger?: string
  adjustment_value?: number
}

export function calculateDynamicPrice(rule: PricingRule, currentInventory = 0, totalInventory = 0): number {
  // Calculate base price
  let price = Math.round(rule.base_cost_cents * rule.markup_multiplier)

  // Apply dynamic adjustments if enabled
  if (rule.dynamic_adjustment && totalInventory > 0) {
    const inventoryRatio = currentInventory / totalInventory

    if (rule.adjustment_trigger === "inventory") {
      // Increase price as inventory gets low
      if (inventoryRatio < 0.2 && inventoryRatio > 0.1) {
        // Less than 20% remaining: apply adjustment
        const adjustmentMultiplier = 1 + (rule.adjustment_value || 15) / 100
        price = Math.round(price * adjustmentMultiplier)
      } else if (inventoryRatio <= 0.1 && inventoryRatio > 0) {
        // Less than 10% remaining: apply higher adjustment
        const adjustmentMultiplier = 1 + ((rule.adjustment_value || 15) * 1.5) / 100
        price = Math.round(price * adjustmentMultiplier)
      }
    }
  }

  // Ensure price stays within bounds
  if (rule.min_price_cents && price < rule.min_price_cents) {
    price = rule.min_price_cents
  }

  if (rule.max_price_cents && price > rule.max_price_cents) {
    price = rule.max_price_cents
  }

  return price
}

export function getPriceChangeIndicator(
  currentPrice: number,
  basePrice: number,
): "increased" | "decreased" | "unchanged" {
  if (currentPrice > basePrice) return "increased"
  if (currentPrice < basePrice) return "decreased"
  return "unchanged"
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function calculateVIPDiscount(price: number, discountPercent: number): number {
  const discount = Math.round(price * (discountPercent / 100))
  return Math.max(0, price - discount)
}
