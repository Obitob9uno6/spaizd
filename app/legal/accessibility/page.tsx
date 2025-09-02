import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Accessibility Statement</h1>
            <p className="text-gray-400">Our commitment to digital accessibility</p>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Our Commitment</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Grow Spaizd is committed to ensuring digital accessibility for people with disabilities. We are
                    continually improving the user experience for everyone and applying the relevant accessibility
                    standards.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Conformance Status</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                    These guidelines explain how to make web content more accessible for people with disabilities.
                  </p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Accessibility Features</h2>
                <div className="text-gray-300 space-y-4">
                  <p>Our website includes the following accessibility features:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Keyboard navigation support</li>
                    <li>Screen reader compatibility</li>
                    <li>High contrast color schemes</li>
                    <li>Descriptive alt text for images</li>
                    <li>Semantic HTML structure</li>
                    <li>Focus indicators for interactive elements</li>
                    <li>Consistent navigation structure</li>
                  </ul>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Feedback and Contact</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We welcome your feedback on the accessibility of Grow Spaizd. Please let us know if you encounter
                    accessibility barriers:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Email:{" "}
                      <a href="mailto:accessibility@growspaizd.com" className="text-led-green hover:underline">
                        accessibility@growspaizd.com
                      </a>
                    </li>
                    <li>Phone: 1-800-GROW-420</li>
                  </ul>
                  <p>We aim to respond to accessibility feedback within 5 business days.</p>
                </div>
              </section>

              <Separator className="bg-gray-700" />

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Technical Specifications</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Accessibility of Grow Spaizd relies on the following technologies to work with the particular
                    combination of web browser and any assistive technologies or plugins installed on your computer:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>HTML</li>
                    <li>WAI-ARIA</li>
                    <li>CSS</li>
                    <li>JavaScript</li>
                  </ul>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
