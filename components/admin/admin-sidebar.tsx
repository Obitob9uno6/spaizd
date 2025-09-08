"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Zap,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Crown,
  Upload,
  Flag,
  Shield,
} from "lucide-react"

interface AdminSidebarProps {
  userProfile: {
    role: string
    email: string
    full_name?: string
  }
  isOwner: boolean
}

export function AdminSidebar({ userProfile, isOwner }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Drops", href: "/admin/drops", icon: Zap },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "VIP Members", href: "/admin/vip", icon: Crown },
    { name: "Image Uploads", href: "/admin/uploads", icon: Upload },
    { name: "Feature Flags", href: "/admin/features", icon: Flag },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Compliance", href: "/admin/compliance", icon: Shield, ownerOnly: true },
    { name: "Settings", href: "/admin/settings", icon: Settings, ownerOnly: true },
  ]

  const filteredNavigation = navigation.filter((item) => !item.ownerOnly || isOwner)

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-cosmic-black border-r border-bud-purple/30 lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b border-bud-purple/30">
        <h1 className="text-xl font-bold text-trichome-frost">Spaizd Admin</h1>
        {isOwner && <Crown className="ml-2 h-5 w-5 text-amber-glow" />}
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-400 mb-2">Logged in as:</div>
        <div className="text-sm text-trichome-frost truncate">{userProfile.email}</div>
        <div className="text-xs text-amber-glow capitalize">{userProfile.role}</div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-bud-purple text-white"
                      : "text-gray-300 hover:bg-bud-purple/20 hover:text-trichome-frost",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
