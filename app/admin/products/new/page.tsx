"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Plus, X } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const [variants, setVariants] = useState([{ size: "", price: "", inventory: "" }])
  const [images, setImages] = useState([""])

  const addVariant = () => {
    setVariants([...variants, { size: "", price: "", inventory: "" }])
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

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/cannabis-cultivation-workspace-with-design-materia.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
            >
              <Link href="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          </div>

          <form className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-black/40 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      className="bg-black/20 border-green-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-white">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-black/20 border-green-500/30 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tshirts">T-Shirts</SelectItem>
                        <SelectItem value="hoodies">Hoodies</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="hats">Hats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    className="bg-black/20 border-green-500/30 text-white min-h-[120px]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="brand" className="text-white">
                      Brand
                    </Label>
                    <Input
                      id="brand"
                      placeholder="e.g., Grow Spaizd"
                      className="bg-black/20 border-green-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-white">
                      Status
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-black/20 border-green-500/30 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card className="bg-black/40 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Image URL or upload"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...images]
                          newImages[index] = e.target.value
                          setImages(newImages)
                        }}
                        className="bg-black/20 border-green-500/30 text-white"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="border-green-500/50 text-green-400 bg-transparent">
                      <Upload className="w-4 h-4" />
                    </Button>
                    {images.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="text-red-400 hover:bg-red-500/10"
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
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card className="bg-black/40 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">Product Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="grid md:grid-cols-4 gap-4 items-end">
                    <div>
                      <Label className="text-white">Size</Label>
                      <Select>
                        <SelectTrigger className="bg-black/20 border-green-500/30 text-white">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Label className="text-white">Price ($)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={variant.price}
                        onChange={(e) => {
                          const newVariants = [...variants]
                          newVariants[index].price = e.target.value
                          setVariants(newVariants)
                        }}
                        className="bg-black/20 border-green-500/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Inventory</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={variant.inventory}
                        onChange={(e) => {
                          const newVariants = [...variants]
                          newVariants[index].inventory = e.target.value
                          setVariants(newVariants)
                        }}
                        className="bg-black/20 border-green-500/30 text-white"
                      />
                    </div>
                    <div>
                      {variants.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          className="text-red-400 hover:bg-red-500/10"
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
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent"
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
                className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                Save as Draft
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">Create Product</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
