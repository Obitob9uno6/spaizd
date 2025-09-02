"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"

export function OrderSummary() {
  const { items, total, subtotal } = useCart()
  
  // Safe calculations with fallbacks
  const safeItems = items || []
  const safeSubtotal = typeof subtotal === 'number' && !isNaN(subtotal) ? subtotal : 0
  const shipping = 9.99
  const tax = safeSubtotal * 0.08
  const finalTotal = safeSubtotal + shipping + tax

  return (
    <Card className="bg-gray-900 border-gray-700 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {safeItems.length > 0 ? (
          <>
            {safeItems.map((item) => (
              <div key={`${item.id}-${item.variantId || 'default'}`} className="flex gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.name || 'Product'} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{item.name || 'Product'}</h4>
                  <p className="text-gray-400 text-sm">{item.variant || 'Default'}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-400 text-sm">Qty: {item.quantity || 1}</span>
                    <span className="text-white font-medium">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <Separator className="bg-gray-700" />

            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${safeSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex justify-between text-white font-semibold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-400 text-center py-8">
            Your cart is empty
          </div>
        )}
      </CardContent>
    </Card>
  )
}
