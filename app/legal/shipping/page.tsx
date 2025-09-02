import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Shipping Policy</h1>
            <p className="text-gray-400">Fast, reliable delivery worldwide</p>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Processing Time</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Orders are typically processed within 1-2 business days. Custom and print-on-demand items may take
                    3-5 business days to process.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Shipping Options</h2>
                <div className="text-gray-300 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Domestic (US)</h3>
                      <ul className="space-y-1">
                        <li>Standard (5-7 days): $5.99</li>
                        <li>Express (2-3 days): $12.99</li>
                        <li>Overnight: $24.99</li>
                        <li>Free shipping on orders $75+</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">International</h3>
                      <ul className="space-y-1">
                        <li>Standard (10-15 days): $15.99</li>
                        <li>Express (5-7 days): $29.99</li>
                        <li>Duties and taxes may apply</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Order Tracking</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Once your order ships, you'll receive a tracking number via email. You can also track your order in
                    your account dashboard.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Shipping Restrictions</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We currently ship to most countries worldwide. Some restrictions may apply:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>PO Boxes (domestic express and overnight only)</li>
                    <li>Military APO/FPO addresses</li>
                    <li>Certain international destinations</li>
                  </ul>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Lost or Damaged Packages</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    If your package is lost or arrives damaged, please contact us within 48 hours of expected delivery.
                    We'll work with the carrier to resolve the issue or send a replacement.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                <div className="text-gray-300">
                  <p>
                    Shipping questions? Contact us at{" "}
                    <a href="mailto:shipping@growspaizd.com" className="text-led-green hover:underline">
                      shipping@growspaizd.com
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
