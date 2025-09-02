import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    By accessing and using Grow Spaizd ("the Service"), you accept and agree to be bound by the terms
                    and provision of this agreement.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Age Requirements</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    You must be at least 21 years old to use this Service. By using the Service, you represent and
                    warrant that you are at least 21 years of age.
                  </p>
                  <p>
                    Cannabis-themed content is intended for educational and entertainment purposes only and is not
                    intended to promote illegal activities.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Product Information</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    All products sold are apparel and accessories with cannabis-themed designs. We do not sell actual
                    cannabis products or any controlled substances.
                  </p>
                  <p>
                    Product descriptions, images, and specifications are provided for informational purposes and may
                    vary slightly from actual products.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Orders and Payment</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    All orders are subject to acceptance and availability. We reserve the right to refuse or cancel
                    orders at our discretion.
                  </p>
                  <p>
                    Payment is processed securely through Stripe. By providing payment information, you authorize us to
                    charge the specified amount.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. VIP Membership</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    VIP memberships provide early access to drops, exclusive discounts, and other benefits as described
                    on our VIP page.
                  </p>
                  <p>Membership benefits may change at our discretion with reasonable notice to members.</p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    All content, designs, logos, and trademarks on this site are owned by Grow Spaizd or our licensors
                    and are protected by intellectual property laws.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Grow Spaizd shall not be liable for any indirect, incidental, special, or consequential damages
                    arising from your use of the Service.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Information</h2>
                <div className="text-gray-300">
                  <p>
                    For questions about these Terms of Service, contact us at{" "}
                    <a href="mailto:legal@growspaizd.com" className="text-led-green hover:underline">
                      legal@growspaizd.com
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
