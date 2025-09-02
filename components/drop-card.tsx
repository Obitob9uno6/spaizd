"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import Link from "next/link"
import { Clock, Users, Zap } from "lucide-react"

interface Drop {
  id: string
  name: string
  slug: string
  description: string
  type: string
  status: string
  start_time: string
  end_time?: string
  max_quantity?: number
  images: string[]
  drop_products: Array<{
    quantity_available: number
    quantity_sold: number
    drop_price_cents: number
    product: {
      name: string
      images: string[]
    }
  }>
}

interface DropCardProps {
  drop: Drop
  status: "live" | "upcoming" | "ended"
}

export function DropCard({ drop, status }: DropCardProps) {
  const totalAvailable = drop.drop_products.reduce((sum, dp) => sum + dp.quantity_available, 0)
  const totalSold = drop.drop_products.reduce((sum, dp) => sum + dp.quantity_sold, 0)
  const remainingItems = totalAvailable - totalSold
  const soldOutPercentage = totalAvailable > 0 ? (totalSold / totalAvailable) * 100 : 0

  const getStatusBadge = () => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-secondary text-secondary-foreground">
            <Zap className="w-3 h-3 mr-1" />
            Live
          </Badge>
        )
      case "upcoming":
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        )
      case "ended":
        return (
          <Badge variant="secondary">
            <Users className="w-3 h-3 mr-1" />
            Ended
          </Badge>
        )
    }
  }

  const getActionButton = () => {
    if (status === "ended") {
      return (
        <Button variant="outline" disabled className="w-full bg-transparent">
          Drop Ended
        </Button>
      )
    }

    if (remainingItems === 0) {
      return (
        <Button variant="outline" disabled className="w-full bg-transparent">
          Sold Out
        </Button>
      )
    }

    return (
      <Link href={`/drops/${drop.slug}`} className="w-full">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {status === "live" ? "Shop Now" : "View Drop"}
        </Button>
      </Link>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
          <img
            src={
              drop.images[0] ||
              drop.drop_products[0]?.product.images[0] ||
              "/placeholder.svg?height=400&width=400&query=cannabis streetwear drop collection" ||
              "/placeholder.svg"
            }
            alt={drop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">{getStatusBadge()}</div>
          {drop.type === "collab" && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-accent text-accent-foreground">Collab</Badge>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-bold text-lg mb-2">{drop.name}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{drop.description}</p>

          {/* Countdown Timer for upcoming drops */}
          {status === "upcoming" && (
            <div className="mb-4">
              <CountdownTimer targetDate={drop.start_time} />
            </div>
          )}

          {/* Progress bar for live drops */}
          {status === "live" && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  {remainingItems} of {totalAvailable} remaining
                </span>
                <span className="font-medium">{Math.round(soldOutPercentage)}% sold</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${soldOutPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Price range */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {drop.drop_products.length > 0 && (
                <span className="font-bold text-lg">
                  ${Math.min(...drop.drop_products.map((dp) => dp.drop_price_cents / 100)).toFixed(2)}
                  {drop.drop_products.length > 1 &&
                    ` - $${Math.max(...drop.drop_products.map((dp) => dp.drop_price_cents / 100)).toFixed(2)}`}
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{drop.drop_products.length} items</span>
          </div>

          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  )
}
