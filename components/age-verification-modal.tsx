"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

export function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasVerified = localStorage.getItem("age-verified")
    if (!hasVerified) {
      setIsOpen(true)
    }
  }, [])

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      localStorage.setItem("age-verified", "true")
      setIsOpen(false)
    } else {
      window.location.href = "https://www.google.com"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-700 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-led-green/20 rounded-full w-fit">
            <Leaf className="h-8 w-8 text-led-green" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Age Verification Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-gray-300 space-y-4">
            <p>
              This website contains cannabis-themed content and products intended for adults 21 years of age or older.
            </p>
            <p className="text-sm">
              By entering this site, you certify that you are at least 21 years old and agree to our Terms of Service.
            </p>
            <p className="text-xs text-gray-400">
              We do not sell actual cannabis products. All items are apparel and accessories with cannabis-themed
              designs.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => handleVerify(false)}
              variant="outline"
              className="flex-1 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
            >
              Under 21
            </Button>
            <Button onClick={() => handleVerify(true)} className="flex-1 bg-led-green hover:bg-led-green/90 text-black">
              21 or Older
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
