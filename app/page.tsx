import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Clock, Users, Zap, Star, Shield, Truck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-secondary text-secondary-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Next Drop: 72 Hours
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Elevate Your Style
              <span className="text-secondary block">with Spaizd</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
              Discover the fusion of comfort and street culture. Premium cannabis streetwear designed for those who
              appreciate quality and authenticity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6">
                Explore the Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Join VIP Access
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <Truck className="w-5 h-5" />
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <Star className="w-5 h-5" />
              <span className="text-sm font-medium">Exclusive Designs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Featured Collection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular pieces, crafted with premium materials and authentic street-inspired designs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src="/black-premium-t-shirt-with-subtle-cannabis-leaf-em.png"
                    alt="Essential Black Tee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Essential Black Tee</h3>
                  <p className="text-muted-foreground text-sm mb-4">Premium cotton with minimalist design</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl">$50</span>
                    <Badge variant="secondary">Limited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product 2 */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src="/green-hoodie-with-cannabis-themed-embroidery-premi.png"
                    alt="Signature Green Hoodie"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Signature Green Hoodie</h3>
                  <p className="text-muted-foreground text-sm mb-4">Signature colorway, premium comfort</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl">$80</span>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product 3 */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src="/gold-snapback-hat-with-cannabis-leaf-logo-premium-.png"
                    alt="Classic Gold Snapback"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Classic Gold Snapback</h3>
                  <p className="text-muted-foreground text-sm mb-4">Classic fit with embroidered logo</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl">$45</span>
                    <Badge variant="secondary">New</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular pieces, crafted with premium materials and authentic cannabis-inspired designs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src="/black-premium-t-shirt-with-subtle-cannabis-leaf-em.png"
                    alt="Grow Room Essentials Tee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">Grow Room Essentials Tee</h3>
                  <p className="text-muted-foreground text-sm mb-4">Premium cotton with minimalist design</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">$50</span>
                    <Badge variant="secondary">Limited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product 2 */}
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src="/green-hoodie-with-cannabis-themed-embroidery-premi.png"
                    alt="LED Green Hoodie"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">LED Green Hoodie</h3>
                  <p className="text-muted-foreground text-sm mb-4">Signature colorway, premium comfort</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">$80</span>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product 3 */}
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src="/gold-snapback-hat-with-cannabis-leaf-logo-premium-.png"
                    alt="Harvest Gold Snapback"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">Harvest Gold Snapback</h3>
                  <p className="text-muted-foreground text-sm mb-4">Classic fit with embroidered logo</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">$45</span>
                    <Badge variant="secondary">New</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* VIP Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground">
            <Zap className="w-4 h-4 mr-2" />
            VIP Exclusive
          </Badge>
          <h2 className="text-3xl font-bold mb-6">Join the Inner Circle</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Get early access to drops, exclusive colorways, and member-only pricing. Be part of the community that gets
            first dibs on everything.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Early Access</h3>
              <p className="text-muted-foreground text-sm">Shop drops 24-72 hours before public release</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Exclusive Drops</h3>
              <p className="text-muted-foreground text-sm">Access to VIP-only colorways and designs</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Member Pricing</h3>
              <p className="text-muted-foreground text-sm">10-20% off all purchases plus free shipping</p>
            </div>
          </div>

          <Link href="/vip">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Explore VIP Membership
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-8">
            Be the first to know about new drops, restocks, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-border rounded-md bg-background text-foreground"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
