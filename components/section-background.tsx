"use client"

import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface SectionBackgroundProps {
  children: ReactNode
}

// Background image mapping for different sections
const backgroundMap: Record<string, string> = {
  // Admin section - professional grow room
  "/admin": "/professional-cannabis-grow-room-with-mature-flower.png",
  
  // Shop section - cultivation workspace
  "/shop": "/cannabis-cultivation-workspace-with-design-materia.png",
  
  // Legal pages - clean indoor grow
  "/legal": "/empty-indoor-cannabis-grow-tent-with-led-lights-an.png",
  
  // Drops section - premium plants
  "/drops": "/premium-cannabis-plants-in-grow-room-with-led-ligh.png",
  
  // VIP section - professional facility
  "/vip": "/professional-indoor-cannabis-cultivation-facility-.png",
  
  // Account/orders - macro trichomes
  "/account": "/macro-cannabis-trichomes-purple.jpg",
  "/orders": "/macro-cannabis-trichomes-purple.jpg",
  
  // Contact/support - cannabis cola
  "/contact": "/cannabis-cola-bud-close-up.jpg",
  "/support": "/cannabis-cola-bud-close-up.jpg",
  
  // Default for other pages
  "/": "/macro-photography-of-cannabis-trichomes-and-purple.jpg"
}

export function SectionBackground({ children }: SectionBackgroundProps) {
  const pathname = usePathname()
  
  // Find the appropriate background image
  let backgroundImage = backgroundMap["/"] // default
  
  // Check for exact matches first
  if (backgroundMap[pathname]) {
    backgroundImage = backgroundMap[pathname]
  } else {
    // Check for partial matches (e.g., /admin/analytics matches /admin)
    for (const [path, image] of Object.entries(backgroundMap)) {
      if (pathname.startsWith(path) && path !== "/") {
        backgroundImage = image
        break
      }
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-[-2]"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 z-[-1]" />
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  )
}