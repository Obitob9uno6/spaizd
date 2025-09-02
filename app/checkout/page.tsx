import { Suspense } from "react"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummary } from "@/components/order-summary"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Suspense fallback={<div className="animate-pulse bg-gray-800 h-96 rounded-lg" />}>
                <CheckoutForm />
              </Suspense>
            </div>

            <div>
              <Suspense fallback={<div className="animate-pulse bg-gray-800 h-96 rounded-lg" />}>
                <OrderSummary />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
