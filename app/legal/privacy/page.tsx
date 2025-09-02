import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, make a
                    purchase, subscribe to our newsletter, or contact us for support.
                  </p>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white mb-2">Personal Information:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Name, email address, phone number</li>
                      <li>Billing and shipping addresses</li>
                      <li>Payment information (processed securely by Stripe)</li>
                      <li>Account preferences and settings</li>
                      <li>Age verification information</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your account and orders</li>
                    <li>Provide customer support</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Improve our products and services</li>
                    <li>Comply with legal obligations</li>
                    <li>Verify age requirements for cannabis-related content</li>
                  </ul>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. We may share your
                    information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>With service providers who help us operate our business</li>
                    <li>To comply with legal obligations or protect our rights</li>
                    <li>In connection with a business transfer or merger</li>
                    <li>With your explicit consent</li>
                  </ul>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Your Rights (GDPR & CCPA)</h2>
                <div className="text-gray-300 space-y-4">
                  <p>Depending on your location, you may have the following rights:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Right to access your personal information</li>
                    <li>Right to correct inaccurate information</li>
                    <li>Right to delete your personal information</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to opt-out of sale (CCPA)</li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, please contact us at{" "}
                    <a href="mailto:privacy@growspaizd.com" className="text-led-green hover:underline">
                      privacy@growspaizd.com
                    </a>
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
                <div className="text-gray-300">
                  <p>
                    If you have questions about this Privacy Policy, please contact us at{" "}
                    <a href="mailto:privacy@growspaizd.com" className="text-led-green hover:underline">
                      privacy@growspaizd.com
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
