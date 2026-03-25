"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Loader2, Save } from "lucide-react"
import Link from "next/link"

interface CouponFormProps {
  initialCoupon?: any
}

export function CouponForm({ initialCoupon }: CouponFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [code, setCode] = useState(initialCoupon?.code || "")
  const [discountType, setDiscountType] = useState(initialCoupon?.discount_type || "percentage")
  const [discountValue, setDiscountValue] = useState(String(initialCoupon?.discount_value || ""))
  const [maxUses, setMaxUses] = useState(String(initialCoupon?.max_uses || ""))
  const [minPurchase, setMinPurchase] = useState(String(initialCoupon?.min_purchase || "0"))
  const [status, setStatus] = useState(initialCoupon?.status || "active")
  const [startDate, setStartDate] = useState(initialCoupon?.start_date?.split("T")[0] || "")
  const [expiryDate, setExpiryDate] = useState(initialCoupon?.expiry_date?.split("T")[0] || "")

  const handleSave = async () => {
    if (!code.trim()) {
      setError("Coupon code is required")
      return
    }
    if (!discountValue || parseFloat(discountValue) <= 0) {
      setError("Discount value must be greater than 0")
      return
    }

    setIsSaving(true)
    setError("")
    const supabase = createClient()

    try {
      const couponData = {
        code: code.toUpperCase().trim(),
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        max_uses: maxUses ? parseInt(maxUses) : null,
        min_purchase: parseFloat(minPurchase) || 0,
        status,
        start_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
        expiry_date: expiryDate ? new Date(expiryDate).toISOString() : null,
      }

      if (initialCoupon?.id) {
        await supabase.from("coupons").update(couponData).eq("id", initialCoupon.id)
        router.push("/admin/promotions")
      } else {
        const { data } = await supabase.from("coupons").insert([couponData]).select().single()
        router.push("/admin/promotions")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save coupon")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm" className="border-bud-purple/30 text-trichome-frost hover:bg-bud-purple/20 bg-transparent">
            <Link href="/admin/promotions">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-trichome-frost">
            {initialCoupon ? "Edit Coupon" : "Create Coupon"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-bud-purple hover:bg-bud-purple/80 text-white">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Coupon
        </Button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">{error}</div>}

      <Card className="bg-cosmic-black border-bud-purple/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost">Coupon Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label className="text-trichome-frost">Coupon Code *</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., SAVE20"
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1 font-mono font-bold text-lg"
              />
            </div>
            <div>
              <Label className="text-trichome-frost">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-cosmic-black border-bud-purple/30">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <Label className="text-trichome-frost">Discount Type *</Label>
              <Select value={discountType} onValueChange={setDiscountType}>
                <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-cosmic-black border-bud-purple/30">
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-trichome-frost">Discount Value *</Label>
              <Input
                type="number"
                step="0.01"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "20" : "5.00"}
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"
              />
            </div>
            <div>
              <Label className="text-trichome-frost">Minimum Purchase ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                placeholder="0.00"
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <Label className="text-trichome-frost">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"
              />
            </div>
            <div>
              <Label className="text-trichome-frost">Expiry Date</Label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"
              />
            </div>
            <div>
              <Label className="text-trichome-frost">Max Uses (Leave blank for unlimited)</Label>
              <Input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="Unlimited"
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button asChild variant="outline" className="border-trichome-frost/30 text-trichome-frost hover:bg-trichome-frost/10 bg-transparent">
          <Link href="/admin/promotions">Cancel</Link>
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-bud-purple hover:bg-bud-purple/80 text-white">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Coupon
        </Button>
      </div>
    </div>
  )
}
