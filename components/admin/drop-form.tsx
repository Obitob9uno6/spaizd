"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Loader2, Save, Plus, X } from "lucide-react"
import Link from "next/link"

interface DropFormProps {
  initialDrop?: any
}

export function DropForm({ initialDrop }: DropFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState(initialDrop?.name || "")
  const [description, setDescription] = useState(initialDrop?.description || "")
  const [status, setStatus] = useState(initialDrop?.status || "scheduled")
  const [startTime, setStartTime] = useState(initialDrop?.start_time ? new Date(initialDrop.start_time).toISOString().slice(0, 16) : "")
  const [endTime, setEndTime] = useState(initialDrop?.end_time ? new Date(initialDrop.end_time).toISOString().slice(0, 16) : "")
  const [vipOnly, setVipOnly] = useState(initialDrop?.vip_only || false)
  const [products, setProducts] = useState<any[]>([])
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [selectedProductId, setSelectedProductId] = useState("")

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("products").select("id, name").order("name")
      setAvailableProducts(data || [])

      if (initialDrop?.drop_products) {
        setProducts(initialDrop.drop_products)
      }
    }
    load()
  }, [initialDrop])

  const addProduct = () => {
    if (!selectedProductId) return
    const product = availableProducts.find((p) => p.id === selectedProductId)
    if (product && !products.find((p) => p.product_id === selectedProductId)) {
      setProducts([...products, { product_id: selectedProductId, product, quantity_available: null }])
      setSelectedProductId("")
    }
  }

  const removeProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Drop name is required")
      return
    }
    if (!startTime) {
      setError("Start time is required")
      return
    }

    setIsSaving(true)
    setError("")
    const supabase = createClient()

    try {
      const slug = name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")

      const dropData = {
        name: name.trim(),
        slug: initialDrop?.slug || slug,
        description: description.trim() || null,
        status,
        start_time: new Date(startTime).toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : null,
        vip_only: vipOnly,
      }

      if (initialDrop?.id) {
        await supabase.from("drops").update(dropData).eq("id", initialDrop.id)
        router.push(`/admin/drops/${initialDrop.id}`)
      } else {
        const { data: newDrop } = await supabase.from("drops").insert([dropData]).select().single()
        if (newDrop) {
          for (const product of products) {
            await supabase.from("drop_products").insert({
              drop_id: newDrop.id,
              product_id: product.product_id,
              quantity_available: product.quantity_available,
            })
          }
          router.push(`/admin/drops/${newDrop.id}`)
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save drop")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm" className="border-bud-purple/30 text-trichome-frost hover:bg-bud-purple/20 bg-transparent">
            <Link href="/admin/drops">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-trichome-frost">
            {initialDrop ? `Edit: ${initialDrop.name}` : "Schedule Drop"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-bud-purple hover:bg-bud-purple/80 text-white">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Drop
        </Button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">{error}</div>}

      <Card className="bg-cosmic-black border-bud-purple/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost">Drop Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-trichome-frost">Drop Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Collection Drop"
              className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"
            />
          </div>

          <div>
            <Label className="text-trichome-frost">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this drop..."
              className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost min-h-[100px] mt-1"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <Label className="text-trichome-frost">Start Date & Time *</Label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"
              />
            </div>
            <div>
              <Label className="text-trichome-frost">End Date & Time</Label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-bud-purple/20">
            <input
              type="checkbox"
              id="vip_only"
              checked={vipOnly}
              onChange={(e) => setVipOnly(e.target.checked)}
              className="w-4 h-4 accent-bud-purple"
            />
            <label htmlFor="vip_only" className="text-trichome-frost text-sm cursor-pointer">
              VIP Members Only
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-cosmic-black border-leaf-green/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost">Products in Drop</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="border-leaf-green/30">
                  <TableHead className="text-trichome-frost">Product</TableHead>
                  <TableHead className="text-trichome-frost">Quantity Available</TableHead>
                  <TableHead className="text-trichome-frost">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, idx) => (
                  <TableRow key={idx} className="border-leaf-green/30">
                    <TableCell className="text-trichome-frost">{product.product?.name || "Unknown"}</TableCell>
                    <TableCell className="text-trichome-frost">{product.quantity_available || "Unlimited"}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => removeProduct(idx)} className="text-red-400 hover:bg-red-500/10">
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex gap-2 pt-2">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger className="bg-cosmic-black/50 border-leaf-green/30 text-trichome-frost flex-1">
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent className="bg-cosmic-black border-leaf-green/30">
                {availableProducts.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addProduct} className="bg-leaf-green hover:bg-leaf-green/80 text-cosmic-black">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button asChild variant="outline" className="border-trichome-frost/30 text-trichome-frost hover:bg-trichome-frost/10 bg-transparent">
          <Link href="/admin/drops">Cancel</Link>
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-bud-purple hover:bg-bud-purple/80 text-white">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Drop
        </Button>
      </div>
    </div>
  )
}
