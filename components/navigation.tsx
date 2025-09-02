"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, ShoppingBag, User, Search } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-sm">GS</span>
            </div>
            <span className="font-bold text-xl text-foreground">Grow Spaizd</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-foreground hover:text-secondary transition-colors">
              Shop
            </Link>
            <Link href="/drops" className="text-foreground hover:text-secondary transition-colors">
              Drops
            </Link>
            <Link href="/vip" className="text-foreground hover:text-secondary transition-colors">
              VIP
            </Link>
            <Link href="/about" className="text-foreground hover:text-secondary transition-colors">
              About
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary text-secondary-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              <Link
                href="/shop"
                className="block px-3 py-2 text-foreground hover:text-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/drops"
                className="block px-3 py-2 text-foreground hover:text-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Drops
              </Link>
              <Link
                href="/vip"
                className="block px-3 py-2 text-foreground hover:text-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                VIP
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-foreground hover:text-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <div className="flex items-center space-x-4 px-3 py-2">
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {itemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary text-secondary-foreground">
                        {itemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
