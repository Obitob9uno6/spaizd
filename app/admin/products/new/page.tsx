"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Plus, X, Tag, ImageIcon } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const [variants, setVariants] = useState([{ size: "", color: "", price: "", inventory: "" }])
  const [images, setImages] = useState([""])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", price: "", inventory: "" }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const addImage = () => {
    setImages([...images, ""])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="min-h-screen bg-cosmic-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-bud-purple/30 text-trichome-frost hover:bg-bud-purple/20 bg-transparent"
            >
              <Link href="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-trichome-frost">Add New Product</h1>
          </div>

          <form className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-cosmic-black border-bud-purple/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-trichome-frost">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-trichome-frost">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-black border-bud-purple/30">
                        <SelectItem value="tshirts">T-Shirts</SelectItem>
                        <SelectItem value="hoodies">Hoodies</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="hats">Hats</SelectItem>
                        <SelectItem value="streetwear">Streetwear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-trichome-frost">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter detailed product description"
                    className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost min-h-[120px]"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="brand" className="text-trichome-frost">
                      Brand
                    </Label>
                    <Input
                      id="brand"
                      placeholder="Spaizd"
                      defaultValue="Spaizd"
                      className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-trichome-frost">
                      Status
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-black border-bud-purple/30">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="base_price" className="text-trichome-frost">
                      Base Price ($)
                    </Label>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-black border-leaf-green/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-leaf-green" />
                  Product Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Upload high-resolution images featuring photorealistic cannabis visuals
                </p>
                {images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Image URL or upload high-res cannabis imagery"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...images]
                          newImages[index] = e.target.value
                          setImages(newImages)
                        }}
                        className="bg-cosmic-black/50 border-leaf-green/30 text-trichome-frost"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-leaf-green/50 text-leaf-green bg-transparent hover:bg-leaf-green/10"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    {images.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="text-pistil-orange hover:bg-pistil-orange/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImage}
                  className="border-leaf-green/50 text-leaf-green hover:bg-leaf-green/10 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-black border-amber-glow/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost flex items-center gap-2">
                  <Tag className="h-5 w-5 text-amber-glow" />
                  Product Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-amber-glow/20 text-amber-glow border-amber-glow/30"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-pistil-orange">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tags (cannabis, streetwear, premium, etc.)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="bg-cosmic-black/50 border-amber-glow/30 text-trichome-frost"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="border-amber-glow/50 text-amber-glow hover:bg-amber-glow/10 bg-transparent"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card className="bg-cosmic-black border-bud-purple/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost">Product Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="grid md:grid-cols-5 gap-4 items-end">
                    <div>
                      <Label className="text-trichome-frost">Size</Label>
                      <Select>
                        <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-black border-bud-purple/30">
                          <SelectItem value="xs">XS</SelectItem>
                          <SelectItem value="s">S</SelectItem>
                          <SelectItem value="m">M</SelectItem>
                          <SelectItem value="l">L</SelectItem>
                          <SelectItem value="xl">XL</SelectItem>
                          <SelectItem value="xxl">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-trichome-frost">Color</Label>
                      <Input
                        placeholder="Color"
                        value={variant.color}
                        onChange={(e) => {
                          const newVariants = [...variants]
                          newVariants[index].color = e.target.value
                          setVariants(newVariants)
                        }}
                        className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                      />
                    </div>
                    <div>
                      <Label className="text-trichome-frost">Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={variant.price}
                        onChange={(e) => {
                          const newVariants = [...variants]
                          newVariants[index].price = e.target.value
                          setVariants(newVariants)
                        }}
                        className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                      />
                    </div>
                    <div>
                      <Label className="text-trichome-frost">Inventory</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={variant.inventory}
                        onChange={(e) => {
                          const newVariants = [...variants]
                          newVariants[index].inventory = e.target.value
                          setVariants(newVariants)
                        }}
                        className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                      />
                    </div>
                    <div>
                      {variants.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          className="text-pistil-orange hover:bg-pistil-orange/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="border-bud-purple/50 text-bud-purple hover:bg-bud-purple/10 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                className="border-trichome-frost/30 text-trichome-frost hover:bg-trichome-frost/10 bg-transparent"
              >
                Save as Draft
              </Button>
              <Button className="bg-bud-purple hover:bg-bud-purple/80 text-white">Create Product</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
