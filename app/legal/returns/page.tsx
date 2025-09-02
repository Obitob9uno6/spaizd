import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Return & Refund Policy</h1>
            <p className="text-gray-400">Your satisfaction is our priority</p>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">30-Day Return Policy</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We offer a 30-day return policy from the date of delivery. Items must be unworn, unwashed, and in
                    original condition with tags attached.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Return Process</h2>
                <div className="text-gray-300 space-y-4">
                  <p>To initiate a return:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Contact our support team at returns@growspaizd.com</li>
                    <li>Provide your order number and reason for return</li>
                    <li>Receive return authorization and shipping label</li>
                    <li>Package items securely and ship using provided label</li>
                    <li>Refund processed within 5-7 business days after receipt</li>
                  </ol>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Exchanges</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We offer free exchanges for size or color within 30 days. Contact us to arrange an exchange before
                    shipping your item back.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Non-Returnable Items</h2>
                <div className="text-gray-300 space-y-4">
                  <p>The following items cannot be returned:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Custom or personalized items</li>
                    <li>Items damaged by misuse</li>
                    <li>Items returned after 30 days</li>
                    <li>Limited edition drop items (unless defective)</li>
                  </ul>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Refund Methods</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Refunds will be issued to the original payment method. Processing time varies by payment provider
                    but typically takes 5-10 business days.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                <div className="text-gray-300">
                  <p>
                    Questions about returns? Contact us at{" "}
                    <a href="mailto:returns@growspaizd.com" className="text-led-green hover:underline">
                      returns@growspaizd.com
                    </a>
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
