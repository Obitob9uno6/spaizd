"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  base_price_cents: number
  images: string[]
  category: {
    name: string
    slug: string
  }
  variants: Array<{
    id: string
    name: string
    size?: string
    color?: string
  }>
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCart()

  const handleAddToCart = (product: Product) => {
    const defaultVariant = product.variants[0]
    if (defaultVariant) {
      addItem({
        id: `${product.id}-${defaultVariant.id}`,
        productId: product.id,
        variantId: defaultVariant.id,
        name: `${product.name} - ${defaultVariant.name}`,
        price: product.base_price_cents / 100,
        image: product.images[0] || "/cannabis-streetwear-product.png",
        size: defaultVariant.size,
        color: defaultVariant.color,
      })
    }
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <Link href={`/shop/products/${product.slug}`}>
              <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                <img
                  src={
                    product.images[0] ||
                    "/placeholder.svg?height=400&width=400&query=premium cannabis streetwear product"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.category?.name}
                </Badge>
              </div>
              <Link href={`/shop/products/${product.slug}`}>
                <h3 className="font-semibold mb-2 hover:text-secondary transition-colors">{product.name}</h3>
              </Link>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">${(product.base_price_cents / 100).toFixed(2)}</span>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
