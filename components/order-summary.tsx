"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"

export function OrderSummary() {
  const { items, total, subtotal } = useCart()
  const shipping = 9.99
  const tax = subtotal * 0.08

  return (
    <Card className="bg-gray-900 border-gray-700 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.variantId}`} className="flex gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">{item.name}</h4>
              <p className="text-gray-400 text-sm">{item.variant}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-400 text-sm">Qty: {item.quantity}</span>
                <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}

        <Separator className="bg-gray-700" />

        <div className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
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
            <span>${(subtotal + shipping + tax).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
