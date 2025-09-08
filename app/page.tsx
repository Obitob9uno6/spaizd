import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Clock, Users, Zap, Star, Shield, Truck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('/macro-photography-of-cannabis-trichomes-and-purple.jpg')`,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-bud-purple text-trichome-frost border-leaf-green">
              <Clock className="w-4 h-4 mr-2" />
              Next Drop: 72 Hours
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-balance text-heading-primary">
              Elevate Your Style
              <span className="text-heading-accent block">with Spaizd</span>
            </h1>
            <p className="text-xl md:text-2xl text-trichome-frost mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              Discover the fusion of comfort and street culture. Premium cannabis streetwear designed for those who
              appreciate quality and authenticity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-bud-purple hover:bg-bud-purple/90 text-trichome-frost text-lg px-8 py-6 border border-leaf-green"
              >
                Explore the Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-transparent border-pistil-orange-subtle text-trichome-frost hover:bg-pistil-orange/10 hover:border-pistil-orange"
              >
                Join VIP Access
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="flex items-center justify-center space-x-3 text-trichome-frost">
              <Shield className="w-5 h-5 text-leaf-green" />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-trichome-frost">
              <Truck className="w-5 h-5 text-leaf-green" />
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-trichome-frost">
              <Star className="w-5 h-5 text-leaf-green" />
              <span className="text-sm font-medium">Exclusive Designs</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-background to-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-heading-primary">Featured Collection</h2>
            <p className="text-xl text-trichome-frost max-w-2xl mx-auto">
              Discover our most popular pieces, crafted with premium materials and authentic street-inspired designs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border border-leaf-green bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted/20 rounded-t-lg overflow-hidden">
                  <img
                    src="/black-premium-t-shirt-with-subtle-cannabis-leaf-em.png"
                    alt="Essential Black Tee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-heading-primary">Essential Black Tee</h3>
                  <p className="text-trichome-frost text-sm mb-4">Premium cotton with minimalist design</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-amber-glow">$50</span>
                    <Badge className="bg-amber-glow text-background">Limited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product 2 */}
            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border border-leaf-green bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted/20 rounded-t-lg overflow-hidden">
                  <img
                    src="/green-hoodie-with-cannabis-themed-embroidery-premi.png"
                    alt="Signature Green Hoodie"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-heading-primary">Signature Green Hoodie</h3>
                  <p className="text-trichome-frost text-sm mb-4">Signature colorway, premium comfort</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-amber-glow">$80</span>
                    <Badge className="bg-bud-purple text-trichome-frost">Popular</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product 3 */}
            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border border-leaf-green bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted/20 rounded-t-lg overflow-hidden">
                  <img
                    src="/gold-snapback-hat-with-cannabis-leaf-logo-premium-.png"
                    alt="Classic Gold Snapback"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-heading-primary">Classic Gold Snapback</h3>
                  <p className="text-trichome-frost text-sm mb-4">Classic fit with embroidered logo</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-amber-glow">$45</span>
                    <Badge className="bg-leaf-green text-trichome-frost">New</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-transparent border-pistil-orange-subtle text-trichome-frost hover:bg-pistil-orange/10 hover:border-pistil-orange"
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card/30 backdrop-blur-sm border-y border-leaf-green">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-bud-purple text-trichome-frost border-leaf-green">
            <Zap className="w-4 h-4 mr-2" />
            VIP Exclusive
          </Badge>
          <h2 className="text-3xl font-bold mb-6 text-heading-primary">Join the Inner Circle</h2>
          <p className="text-trichome-frost mb-8 text-lg leading-relaxed">
            Get early access to drops, exclusive colorways, and member-only pricing. Be part of the community that gets
            first dibs on everything.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-bud-purple rounded-full flex items-center justify-center mb-4 border border-leaf-green">
                <Clock className="w-6 h-6 text-trichome-frost" />
              </div>
              <h3 className="font-semibold mb-2 text-heading-accent">Early Access</h3>
              <p className="text-trichome-frost text-sm">Shop drops 24-72 hours before public release</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-bud-purple rounded-full flex items-center justify-center mb-4 border border-leaf-green">
                <Users className="w-6 h-6 text-trichome-frost" />
              </div>
              <h3 className="font-semibold mb-2 text-heading-accent">Exclusive Drops</h3>
              <p className="text-trichome-frost text-sm">Access to VIP-only colorways and designs</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-bud-purple rounded-full flex items-center justify-center mb-4 border border-leaf-green">
                <Zap className="w-6 h-6 text-trichome-frost" />
              </div>
              <h3 className="font-semibold mb-2 text-heading-accent">Member Pricing</h3>
              <p className="text-trichome-frost text-sm">10-20% off all purchases plus free shipping</p>
            </div>
          </div>

          <Link href="/vip">
            <Button
              size="lg"
              className="bg-bud-purple hover:bg-bud-purple/90 text-trichome-frost border border-pistil-orange-subtle hover:border-pistil-orange"
            >
              Explore VIP Membership
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-heading-primary">Stay in the Loop</h2>
          <p className="text-trichome-frost mb-8">
            Be the first to know about new drops, restocks, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-leaf-green rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-bud-purple focus:border-bud-purple"
            />
            <Button className="bg-bud-purple hover:bg-bud-purple/90 text-trichome-frost border border-leaf-green">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
