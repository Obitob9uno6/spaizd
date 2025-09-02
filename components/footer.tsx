import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-led-green rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">GS</span>
              </div>
              <span className="font-bold text-xl text-white">Grow Spaizd</span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium cannabis streetwear for the community. Exclusive drops, quality materials, authentic designs.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Shop</h3>
            <div className="space-y-2">
              <Link
                href="/shop?category=tshirts"
                className="block text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                T-Shirts
              </Link>
              <Link
                href="/shop?category=hoodies"
                className="block text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                Hoodies
              </Link>
              <Link
                href="/shop?category=hats"
                className="block text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                Hats
              </Link>
              <Link
                href="/shop?category=accessories"
                className="block text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                Accessories
              </Link>
              <Link href="/drops" className="block text-gray-400 hover:text-led-green transition-colors text-sm">
                Limited Drops
              </Link>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Account</h3>
            <div className="space-y-2">
              <Link href="/auth/login" className="block text-gray-400 hover:text-led-green transition-colors text-sm">
                Sign In
              </Link>
              <Link href="/auth/sign-up" className="block text-gray-400 hover:text-led-green transition-colors text-sm">
                Create Account
              </Link>
              <Link href="/vip" className="block text-gray-400 hover:text-led-green transition-colors text-sm">
                VIP Membership
              </Link>
              <Link href="/account" className="block text-gray-400 hover:text-led-green transition-colors text-sm">
                My Account
              </Link>
              <Link
                href="/account/orders"
                className="block text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                Order History
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">Legal & Support</h3>
            <div className="space-y-2">
              <Link
                href="/legal/privacy"
                className="block text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="block text-gray-400 hover:text-led-green transition-colors text-sm">
                Terms of Service
              </Link>
              <Link
                href="/legal/shipping"
                className="block text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                Shipping Policy
              </Link>
              <Link
                href="/legal/returns"
                className="block text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                Returns & Refunds
              </Link>
              <Link
                href="/legal/accessibility"
                className="block text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                Accessibility
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-led-green transition-colors text-sm">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">© 2024 Grow Spaizd. All rights reserved.</p>
              <p className="text-gray-500 text-xs mt-1">
                Cannabis-themed apparel only. No actual cannabis products sold. 21+ only.
              </p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/contact" className="text-gray-400 hover:text-led-green transition-colors text-sm">
                Contact
              </Link>
              <Link
                href="/legal/accessibility"
                className="text-gray-400 hover:text-led-green transition-colors text-sm"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
