"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

interface PromotionFormProps {
  initialPromotion?: any
}

export function PromotionForm({ initialPromotion }: PromotionFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState(initialPromotion?.name || "")
  const [description, setDescription] = useState(initialPromotion?.description || "")
  const [discountType, setDiscountType] = useState(initialPromotion?.discount_type || "percentage")
  const [discountValue, setDiscountValue] = useState(String(initialPromotion?.discount_value || ""))
  const [applicableCategories, setApplicableCategories] = useState(initialPromotion?.applicable_categories?.join(", ") || "")
  const [status, setStatus] = useState(initialPromotion?.status || "active")
  const [startDate, setStartDate] = useState(initialPromotion?.start_date?.split("T")[0] || "")
  const [endDate, setEndDate] = useState(initialPromotion?.end_date?.split("T")[0] || "")

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Promotion name is required")
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
      const promotionData = {
        name: name.trim(),
        description: description.trim() || null,
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        applicable_categories: applicableCategories
          ? applicableCategories.split(",").map((c) => c.trim())
          : null,
        status,
        start_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : null,
      }

      if (initialPromotion?.id) {
        await supabase.from("promotions").update(promotionData).eq("id", initialPromotion.id)
      } else {
        await supabase.from("promotions").insert([promotionData])
      }

      router.push("/admin/promotions")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save promotion")
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
            {initialPromotion ? "Edit Promotion" : "Create Promotion"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-bud-purple hover:bg-bud-purple/80 text-white">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Promotion
        </Button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">{error}</div>}

      <Card className="bg-cosmic-black border-bud-purple/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost">Promotion Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label className="text-trichome-frost">Promotion Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer Sale 20% Off"
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"
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

          <div>
            <Label className="text-trichome-frost">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this promotion..."
              className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost min-h-[100px] mt-1"
            />
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
                placeholder={discountType === "percentage" ? "20" : "50.00"}
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"
              />
            </div>
            <div>
              <Label className="text-trichome-frost">Applicable Categories</Label>
              <Input
                value={applicableCategories}
                onChange={(e) => setApplicableCategories(e.target.value)}
                placeholder="e.g., tshirts, hoodies, hats"
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1 text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
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
              <Label className="text-trichome-frost">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
          Save Promotion
        </Button>
      </div>
    </div>
  )
}
