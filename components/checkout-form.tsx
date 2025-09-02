"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CreditCard, Lock, Truck } from "lucide-react"

export function CheckoutForm() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const supabase = createClientComponentClient()

  // Safe total calculation with fallback
  const safeTotal = typeof total === 'number' && !isNaN(total) ? total : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create order in database
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          total_amount: safeTotal,
          status: "pending",
          shipping_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          items: items?.map((item) => ({
            product_id: item.id,
            variant_id: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })) || [],
        })
        .select()
        .single()

      if (error) throw error

      // Create order items
      if (items && items.length > 0) {
        for (const item of items) {
          await supabase.from("order_items").insert({
            order_id: order.id,
            product_id: item.id,
            variant_id: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })
        }
      }

      // In a real implementation, this would integrate with Stripe
      // For now, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update order status
      await supabase.from("orders").update({ status: "confirmed", payment_status: "paid" }).eq("id", order.id)

      clearCart()
      router.push(`/orders/${order.id}/confirmation`)
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-led-green" />
            Contact & Shipping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-300">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-300">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-gray-300">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-gray-300">
                City
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-gray-300">
                State
              </Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="zipCode" className="text-gray-300">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-led-green" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nameOnCard" className="text-gray-300">
              Name on Card
            </Label>
            <Input
              id="nameOnCard"
              name="nameOnCard"
              value={formData.nameOnCard}
              onChange={handleInputChange}
              required
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="cardNumber" className="text-gray-300">
              Card Number
            </Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate" className="text-gray-300">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-gray-300">
                CVV
              </Label>
              <Input
                id="cvv"
                name="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Lock className="h-4 w-4" />
            Your payment information is secure and encrypted
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={loading || !items || items.length === 0}
        className="w-full bg-led-green hover:bg-led-green/90 text-black font-semibold py-3"
      >
        {loading ? "Processing..." : `Complete Order - $${safeTotal.toFixed(2)}`}
      </Button>
    </form>
  )
}
