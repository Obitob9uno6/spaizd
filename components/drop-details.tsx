"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { DynamicPricing } from "@/components/dynamic-pricing"
import { useCart } from "@/hooks/use-cart"
import { Clock, Users, Zap, ShoppingBag } from "lucide-react"

interface Drop {
  id: string
  name: string
  description: string
  type: string
  start_time: string
  end_time?: string
  max_quantity?: number
  images: string[]
  drop_products: Array<{
    id: string
    quantity_available: number
    quantity_sold: number
    drop_price_cents: number
    max_per_customer: number
    product: {
      id: string
      name: string
      description: string
      images: string[]
    }
    variant: {
      id: string
      name: string
      size?: string
      color?: string
    }
  }>
}

interface DropDetailsProps {
  drop: Drop
  status: "upcoming" | "live" | "ended"
}

export function DropDetails({ drop, status }: DropDetailsProps) {
  const { addItem } = useCart()

  const totalAvailable = drop.drop_products.reduce((sum, dp) => sum + dp.quantity_available, 0)
  const totalSold = drop.drop_products.reduce((sum, dp) => sum + dp.quantity_sold, 0)
  const remainingItems = totalAvailable - totalSold

  const handleAddToCart = (dropProduct: Drop["drop_products"][0]) => {
    addItem({
      id: `drop-${dropProduct.id}`,
      productId: dropProduct.product.id,
      variantId: dropProduct.variant.id,
      name: `${dropProduct.product.name} - ${dropProduct.variant.name}`,
      price: dropProduct.drop_price_cents / 100,
      image: dropProduct.product.images[0] || "/cannabis-streetwear-product.png",
      size: dropProduct.variant.size,
      color: dropProduct.variant.color,
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <img
            src={
              drop.images[0] ||
              drop.drop_products[0]?.product.images[0] ||
              "/placeholder.svg?height=600&width=600&query=cannabis streetwear drop hero image" ||
              "/placeholder.svg"
            }
            alt={drop.name}
            className="w-full h-full object-cover"
          />
        </div>
        {drop.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {drop.images.slice(1, 5).map((image, index) => (
              <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${drop.name} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {status === "live" && (
              <Badge className="bg-secondary text-secondary-foreground">
                <Zap className="w-3 h-3 mr-1" />
                Live Now
              </Badge>
            )}
            {status === "upcoming" && (
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                Coming Soon
              </Badge>
            )}
            {status === "ended" && (
              <Badge variant="secondary">
                <Users className="w-3 h-3 mr-1" />
                Ended
              </Badge>
            )}
            {drop.type === "collab" && <Badge className="bg-accent text-accent-foreground">Collaboration</Badge>}
            {drop.type === "limited" && <Badge variant="outline">Limited Edition</Badge>}
          </div>
          <h1 className="text-3xl font-bold mb-4">{drop.name}</h1>
          <p className="text-muted-foreground text-lg">{drop.description}</p>
        </div>

        {/* Countdown for upcoming drops */}
        {status === "upcoming" && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Drop starts in:</h3>
              <CountdownTimer targetDate={drop.start_time} />
            </CardContent>
          </Card>
        )}

        {/* Availability info for live drops */}
        {status === "live" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Availability</h3>
                <span className="text-sm text-muted-foreground">
                  {remainingItems} of {totalAvailable} remaining
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mb-2">
                <div
                  className="bg-secondary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${totalAvailable > 0 ? (totalSold / totalAvailable) * 100 : 0}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {Math.round(totalAvailable > 0 ? (totalSold / totalAvailable) * 100 : 0)}% sold
              </p>
            </CardContent>
          </Card>
        )}

        {/* Products */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Items in this drop</h3>
          {drop.drop_products.map((dropProduct) => (
            <Card key={dropProduct.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        dropProduct.product.images[0] ||
                        "/placeholder.svg?height=64&width=64&query=cannabis streetwear product" ||
                        "/placeholder.svg"
                      }
                      alt={dropProduct.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{dropProduct.product.name}</h4>
                    <p className="text-sm text-muted-foreground">{dropProduct.variant.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <DynamicPricing
                        basePrice={dropProduct.drop_price_cents}
                        currentInventory={dropProduct.quantity_available - dropProduct.quantity_sold}
                        totalInventory={dropProduct.quantity_available}
                      />
                      <span className="text-xs text-muted-foreground">
                        {dropProduct.quantity_available - dropProduct.quantity_sold} left
                      </span>
                    </div>
                  </div>
                  {status === "live" && dropProduct.quantity_available - dropProduct.quantity_sold > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(dropProduct)}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                  {status === "live" && dropProduct.quantity_available - dropProduct.quantity_sold === 0 && (
                    <Button size="sm" variant="outline" disabled className="bg-transparent">
                      Sold Out
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
