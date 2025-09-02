import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react"

export default function SupportPage() {
  const faqs = [
    {
      category: "Orders",
      questions: [
        {
          q: "How can I track my order?",
          a: "You can track your order in your account dashboard or use the tracking link sent to your email.",
        },
        {
          q: "Can I modify my order after placing it?",
          a: "Orders can be modified within 1 hour of placement. Contact support immediately for changes.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, and Apple Pay through our secure Stripe integration.",
        },
      ],
    },
    {
      category: "Shipping",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.",
        },
        {
          q: "Do you ship internationally?",
          a: "Yes, we ship worldwide. International orders take 10-15 business days for standard shipping.",
        },
        {
          q: "What if my package is lost or damaged?",
          a: "Contact us within 48 hours of expected delivery. We'll work with the carrier to resolve the issue.",
        },
      ],
    },
    {
      category: "VIP Membership",
      questions: [
        {
          q: "What are the VIP membership benefits?",
          a: "VIP members get early access to drops, exclusive discounts, free shipping, and member-only products.",
        },
        {
          q: "How do I upgrade my membership tier?",
          a: "Visit your VIP dashboard to upgrade your membership tier and unlock additional benefits.",
        },
        {
          q: "Can I cancel my VIP membership?",
          a: "Yes, you can cancel anytime from your account settings. Benefits remain active until the end of your billing period.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Support Center</h1>
            <p className="text-gray-400 text-lg">Find answers to your questions or get in touch with our team</p>
          </div>

          {/* Search */}
          <Card className="bg-gray-900 border-gray-700 mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input placeholder="Search for help..." className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gray-900 border-gray-700 hover:border-led-green transition-colors">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-led-green mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-400 text-sm mb-4">Get instant help from our support team</p>
                <Button className="bg-led-green hover:bg-led-green/90 text-black">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-led-green transition-colors">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-led-green mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Email Support</h3>
                <p className="text-gray-400 text-sm mb-4">Send us a detailed message</p>
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                >
                  <Link href="/contact">Send Email</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-led-green transition-colors">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-led-green mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-400 text-sm mb-4">Call us during business hours</p>
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                  1-800-GROW-420
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>

            {faqs.map((section) => (
              <Card key={section.category} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-led-green" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.questions.map((faq, index) => (
                    <div key={index} className="border-b border-gray-700 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                      <p className="text-gray-400 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Resources */}
          <Card className="bg-gray-900 border-gray-700 mt-12">
            <CardHeader>
              <CardTitle className="text-white">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Policies</h4>
                  <div className="space-y-2">
                    <Link href="/legal/returns" className="block text-gray-400 hover:text-led-green text-sm">
                      Return & Refund Policy
                    </Link>
                    <Link href="/legal/shipping" className="block text-gray-400 hover:text-led-green text-sm">
                      Shipping Policy
                    </Link>
                    <Link href="/legal/privacy" className="block text-gray-400 hover:text-led-green text-sm">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Account Help</h4>
                  <div className="space-y-2">
                    <Link href="/account" className="block text-gray-400 hover:text-led-green text-sm">
                      Manage Account
                    </Link>
                    <Link href="/vip" className="block text-gray-400 hover:text-led-green text-sm">
                      VIP Membership
                    </Link>
                    <Link href="/account/orders" className="block text-gray-400 hover:text-led-green text-sm">
                      Order History
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
