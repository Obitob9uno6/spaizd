"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface DynamicPricingProps {
  basePrice: number // in cents
  currentInventory: number
  totalInventory: number
}

export function DynamicPricing({ basePrice, currentInventory, totalInventory }: DynamicPricingProps) {
  const [currentPrice, setCurrentPrice] = useState(basePrice)
  const [priceIncreased, setPriceIncreased] = useState(false)

  useEffect(() => {
    // Calculate inventory ratio
    const inventoryRatio = totalInventory > 0 ? currentInventory / totalInventory : 0

    // Apply dynamic pricing when inventory is low
    let adjustedPrice = basePrice
    if (inventoryRatio < 0.2 && inventoryRatio > 0) {
      // Increase price by 15% when less than 20% inventory remains
      adjustedPrice = Math.round(basePrice * 1.15)
      setPriceIncreased(true)
    } else if (inventoryRatio < 0.1 && inventoryRatio > 0) {
      // Increase price by 25% when less than 10% inventory remains
      adjustedPrice = Math.round(basePrice * 1.25)
      setPriceIncreased(true)
    } else {
      setPriceIncreased(false)
    }

    setCurrentPrice(adjustedPrice)
  }, [basePrice, currentInventory, totalInventory])

  const displayPrice = (currentPrice / 100).toFixed(2)
  const originalPrice = (basePrice / 100).toFixed(2)

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-lg">${displayPrice}</span>
      {priceIncreased && (
        <>
          <span className="text-sm text-muted-foreground line-through">${originalPrice}</span>
          <Badge variant="destructive" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Price Rising
          </Badge>
        </>
      )}
    </div>
  )
}
