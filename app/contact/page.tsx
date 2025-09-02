import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-gray-400 text-lg">Get in touch with our team</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">
                        First Name
                      </Label>
                      <Input id="firstName" className="bg-gray-800 border-gray-600 text-white" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">
                        Last Name
                      </Label>
                      <Input id="lastName" className="bg-gray-800 border-gray-600 text-white" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-gray-300">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-300">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button className="w-full bg-led-green hover:bg-led-green/90 text-black">Send Message</Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-led-green mt-1" />
                    <div>
                      <h3 className="text-white font-medium">Email</h3>
                      <p className="text-gray-400">support@growspaizd.com</p>
                      <p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-led-green mt-1" />
                    <div>
                      <h3 className="text-white font-medium">Phone</h3>
                      <p className="text-gray-400">1-800-GROW-420</p>
                      <p className="text-gray-400 text-sm">Mon-Fri 9AM-6PM PST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-led-green mt-1" />
                    <div>
                      <h3 className="text-white font-medium">Address</h3>
                      <p className="text-gray-400">
                        420 Cannabis Ave
                        <br />
                        Los Angeles, CA 90210
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-led-green mt-1" />
                    <div>
                      <h3 className="text-white font-medium">Business Hours</h3>
                      <p className="text-gray-400">Monday - Friday: 9AM - 6PM PST</p>
                      <p className="text-gray-400">Saturday: 10AM - 4PM PST</p>
                      <p className="text-gray-400">Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Order Issues</h4>
                    <p className="text-gray-400 text-sm">For order status, returns, or shipping questions</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">VIP Membership</h4>
                    <p className="text-gray-400 text-sm">Questions about VIP benefits and exclusive access</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Product Information</h4>
                    <p className="text-gray-400 text-sm">Sizing, materials, and product details</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
