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
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Tag, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [variants, setVariants] = useState([{ size: "", color: "", price: "", inventory: "" }])
  const [images, setImages] = useState([""])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("Spaizd")
  const [status, setStatus] = useState("draft")
  const [basePrice, setBasePrice] = useState("")

  const addVariant = () => setVariants([...variants, { size: "", color: "", price: "", inventory: "" }])
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i))
  const addImage = () => setImages([...images, ""])
  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i))
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }
  const removeTag = (t: string) => setTags(tags.filter((tag) => tag !== t))

  const handleSave = async (saveStatus: string) => {
    if (!name.trim()) { setError("Product name is required"); return }
    if (!category) { setError("Category is required"); return }
    setIsSaving(true)
    setError("")
    const supabase = createClient()
    try {
      const { data: product, error: pErr } = await supabase
        .from("products")
        .insert({
          name: name.trim(),
          description,
          category,
          brand,
          status: saveStatus,
          base_price: parseFloat(basePrice) || 0,
          tags,
          images: images.filter(Boolean),
        })
        .select()
        .single()

      if (pErr) throw pErr

      for (const v of variants.filter((vv) => vv.size)) {
        await supabase.from("product_variants").insert({
          product_id: product.id,
          size: v.size,
          color: v.color,
          price: parseFloat(v.price) || parseFloat(basePrice) || 0,
          inventory_count: parseInt(v.inventory) || 0,
          sku: `${product.id.slice(0, 8)}-${v.size}-${v.color || "default"}`.toUpperCase(),
        })
      }

      router.push(`/admin/products/${product.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create product")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm" className="border-bud-purple/30 text-trichome-frost hover:bg-bud-purple/20 bg-transparent">
          <Link href="/admin/products"><ArrowLeft className="w-4 h-4 mr-2" />Back to Products</Link>
        </Button>
        <h1 className="text-3xl font-bold text-trichome-frost">Add New Product</h1>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">{error}</div>}

      <div className="space-y-6">
        {/* Basic Info */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader><CardTitle className="text-trichome-frost">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-trichome-frost">Product Name *</Label>
                <Input id="name" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1" />
              </div>
              <div>
                <Label className="text-trichome-frost">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-black border-bud-purple/30">
                    {["tshirts","hoodies","accessories","hats","streetwear"].map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-trichome-frost">Description</Label>
              <Textarea id="description" placeholder="Enter detailed product description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost min-h-[100px] mt-1" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label className="text-trichome-frost">Brand</Label>
                <Input placeholder="Spaizd" value={brand} onChange={(e) => setBrand(e.target.value)} className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1" />
              </div>
              <div>
                <Label className="text-trichome-frost">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-black border-bud-purple/30">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-trichome-frost">Base Price ($)</Label>
                <Input type="number" step="0.01" placeholder="0.00" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="bg-cosmic-black border-leaf-green/30">
          <CardHeader><CardTitle className="text-trichome-frost">Product Images</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder="Image URL" value={img} onChange={(e) => { const n=[...images]; n[i]=e.target.value; setImages(n) }} className="bg-cosmic-black/50 border-leaf-green/30 text-trichome-frost flex-1" />
                {images.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeImage(i)} className="text-pistil-orange hover:bg-pistil-orange/10"><X className="w-4 h-4" /></Button>}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addImage} className="border-leaf-green/50 text-leaf-green hover:bg-leaf-green/10 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />Add Image URL
            </Button>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="bg-cosmic-black border-amber-glow/30">
          <CardHeader><CardTitle className="text-trichome-frost flex items-center gap-2"><Tag className="h-5 w-5 text-amber-glow" />Tags</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge key={t} className="bg-amber-glow/20 text-amber-glow border-amber-glow/30">
                  {t}<button onClick={() => removeTag(t)} className="ml-2"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} className="bg-cosmic-black/50 border-amber-glow/30 text-trichome-frost" />
              <Button type="button" onClick={addTag} variant="outline" className="border-amber-glow/50 text-amber-glow hover:bg-amber-glow/10 bg-transparent">Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader><CardTitle className="text-trichome-frost">Product Variants</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end p-3 bg-cosmic-black/50 rounded-lg border border-bud-purple/20">
                <div>
                  <Label className="text-trichome-frost text-sm">Size</Label>
                  <Select value={v.size} onValueChange={(val) => { const n=[...variants]; n[i].size=val; setVariants(n) }}>
                    <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1"><SelectValue placeholder="Size" /></SelectTrigger>
                    <SelectContent className="bg-cosmic-black border-bud-purple/30">
                      {["XS","S","M","L","XL","XXL","One Size"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-trichome-frost text-sm">Color</Label>
                  <Input placeholder="Black" value={v.color} onChange={(e) => { const n=[...variants]; n[i].color=e.target.value; setVariants(n) }} className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1" />
                </div>
                <div>
                  <Label className="text-trichome-frost text-sm">Price ($)</Label>
                  <Input type="number" step="0.01" placeholder="0.00" value={v.price} onChange={(e) => { const n=[...variants]; n[i].price=e.target.value; setVariants(n) }} className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1" />
                </div>
                <div>
                  <Label className="text-trichome-frost text-sm">Inventory</Label>
                  <Input type="number" placeholder="0" value={v.inventory} onChange={(e) => { const n=[...variants]; n[i].inventory=e.target.value; setVariants(n) }} className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost mt-1" />
                </div>
                <div className="flex justify-end">
                  {variants.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(i)} className="text-pistil-orange hover:bg-pistil-orange/10"><X className="w-4 h-4" /></Button>}
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addVariant} className="border-bud-purple/50 text-bud-purple hover:bg-bud-purple/10 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />Add Variant
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => handleSave("draft")} disabled={isSaving} className="border-trichome-frost/30 text-trichome-frost hover:bg-trichome-frost/10 bg-transparent">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}Save as Draft
          </Button>
          <Button type="button" onClick={() => handleSave("active")} disabled={isSaving} className="bg-bud-purple hover:bg-bud-purple/80 text-white">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}Create Product
          </Button>
        </div>
      </div>
    </div>
  )
}
