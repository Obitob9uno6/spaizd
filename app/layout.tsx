import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import GrowRoomEntrance from "@/components/grow-room-entrance"
import { Footer } from "@/components/footer"
import { AgeVerificationModal } from "@/components/age-verification-modal"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Spaizd - Premium Cannabis Streetwear", // Updated from "Grow Spaizd" to "Spaizd"
  description:
    "Exclusive cannabis-themed streetwear drops, VIP memberships, and premium apparel for the cannabis community.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <GrowRoomEntrance />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <AgeVerificationModal />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
