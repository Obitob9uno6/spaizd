import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/professional-indoor-cannabis-cultivation-facility-.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">About Grow Spaizd</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Premium cannabis-inspired streetwear for the cultivation community. Where passion meets fashion in the
              grow room.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-green-500/20">
              <h2 className="text-3xl font-bold text-green-400 mb-4">Our Story</h2>
              <p className="text-gray-200 mb-4">
                Born from the underground cultivation scene, Grow Spaizd represents the intersection of cannabis culture
                and high-end streetwear. We understand the dedication, precision, and artistry that goes into every
                grow.
              </p>
              <p className="text-gray-200">
                Our designs celebrate the grower's journey - from seed to harvest, from passion project to lifestyle.
                Every piece tells the story of late nights under grow lights, the satisfaction of a perfect cure, and
                the community that binds us together.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-green-500/20">
              <h2 className="text-3xl font-bold text-green-400 mb-4">Our Mission</h2>
              <p className="text-gray-200 mb-4">
                To create premium apparel that honors the craft of cultivation while pushing the boundaries of
                streetwear design. We're not just making clothes - we're building a culture.
              </p>
              <p className="text-gray-200">
                Every drop is limited, every design is intentional, and every piece is crafted for those who understand
                that growing isn't just a hobby - it's a way of life.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-green-500/20 mb-16">
            <h2 className="text-3xl font-bold text-green-400 mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-white mb-2">Quality First</h3>
                <p className="text-gray-300">
                  Like a perfect grow, we never compromise on quality. Premium materials, precise construction,
                  exceptional results.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-xl font-bold text-white mb-2">Limited Drops</h3>
                <p className="text-gray-300">
                  Exclusivity drives desire. Our limited releases ensure you're wearing something truly special and
                  rare.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-white mb-2">Community</h3>
                <p className="text-gray-300">
                  Built by growers, for growers. We're part of a community that shares knowledge, passion, and respect
                  for the craft.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Join the Culture?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/shop">Shop Collection</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                <Link href="/vip">Join VIP</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
