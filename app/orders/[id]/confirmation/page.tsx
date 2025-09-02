import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { CheckCircle, Package, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OrderConfirmationPageProps {
  params: {
    id: string
  }
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const supabase = createServerComponentClient({ cookies })

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-led-green mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-400">Thank you for your purchase. Your order has been received.</p>
          </div>

          <Card className="bg-gray-900 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Order Number:</span>
                  <p className="text-white font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Order Date:</span>
                  <p className="text-white font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Total:</span>
                  <p className="text-white font-medium">${order.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="text-led-green font-medium capitalize">{order.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-led-green mt-1" />
                <div>
                  <h4 className="text-white font-medium">Processing</h4>
                  <p className="text-gray-400 text-sm">
                    Your order is being prepared for shipment. This usually takes 1-2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h4 className="text-gray-300 font-medium">Shipping</h4>
                  <p className="text-gray-400 text-sm">Once shipped, you'll receive tracking information via email.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button asChild className="flex-1 bg-led-green hover:bg-led-green/90 text-black">
              <Link href="/account/orders">View All Orders</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
