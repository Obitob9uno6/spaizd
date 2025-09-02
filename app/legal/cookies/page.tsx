import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
            <p className="text-gray-400">How we use cookies and similar technologies</p>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Cookies are small text files that are placed on your device when you visit our website. They help us
                    provide you with a better experience by remembering your preferences and analyzing how you use our
                    site.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Essential Cookies</h3>
                    <p>Required for the website to function properly. These include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Authentication and security cookies</li>
                      <li>Shopping cart functionality</li>
                      <li>Age verification status</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Analytics Cookies</h3>
                    <p>Help us understand how visitors interact with our website:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Google Analytics (anonymized)</li>
                      <li>Vercel Analytics</li>
                      <li>Page view tracking</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Functional Cookies</h3>
                    <p>Enhance your experience by remembering your preferences:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Language preferences</li>
                      <li>Theme settings</li>
                      <li>Recently viewed products</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Marketing Cookies</h3>
                    <p>Used to deliver relevant advertisements (with your consent):</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Social media integration</li>
                      <li>Email marketing preferences</li>
                      <li>Retargeting pixels</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
                <div className="text-gray-300 space-y-4">
                  <p>You can control cookies through your browser settings:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Block all cookies</li>
                    <li>Allow only essential cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Set preferences for specific websites</li>
                  </ul>
                  <p className="mt-4">
                    Note: Disabling certain cookies may affect website functionality and your user experience.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We use services from trusted third parties that may set their own cookies:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Stripe (payment processing)</li>
                    <li>Google Analytics (website analytics)</li>
                    <li>Printful (order fulfillment)</li>
                    <li>Supabase (authentication and data)</li>
                  </ul>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                <div className="text-gray-300">
                  <p>
                    Questions about our cookie policy? Contact us at{" "}
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
