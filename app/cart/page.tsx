"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/empty-indoor-cannabis-grow-tent-with-led-lights-an.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-12 border border-green-500/20">
              <ShoppingBag className="w-24 h-24 text-green-400 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
              <p className="text-gray-300 mb-8">
                Time to fill it up with some premium cannabis streetwear. Check out our latest drops and exclusive
                collections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/shop">Browse Collection</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                >
                  <Link href="/drops">View Drops</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/professional-cannabis-grow-room-with-mature-flower.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-green-500/20 overflow-hidden">
            <div className="p-8 border-b border-green-500/20">
              <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
              <p className="text-green-400">{getItemCount()} items in your cart</p>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {items.map((item) => (
                  <Card key={`${item.id}-${item.size}`} className="bg-black/20 border-green-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div
                          className="w-24 h-24 rounded-lg bg-cover bg-center"
                          style={{
                            backgroundImage: `url('/--item-name--cannabis-streetwear-product.png')`,
                          }}
                        ></div>

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{item.name}</h3>
                          <p className="text-green-400">Size: {item.size}</p>
                          <p className="text-2xl font-bold text-green-400 mt-2">${item.price}</p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
                            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-white font-bold text-lg w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-green-500/20">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-white">Total:</span>
                  <span className="text-3xl font-bold text-green-400">${getTotal().toFixed(2)}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                  >
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                  <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 flex-1">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
