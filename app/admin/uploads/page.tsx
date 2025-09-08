"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploadZone } from "@/components/admin/image-upload-zone"
import { ImageGallery } from "@/components/admin/image-gallery"
import { Upload, ImageIcon, Search, Grid, List } from "lucide-react"

export default function AdminUploadsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [uploadedImages, setUploadedImages] = useState([
    {
      id: "1",
      name: "cosmic-trichomes-macro.jpg",
      url: "/macro-cannabis-trichomes-purple.jpg",
      category: "product",
      tags: ["trichomes", "macro", "purple", "cannabis"],
      size: "2.4 MB",
      dimensions: "1920x1080",
      uploadedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "nebula-cola-close-up.jpg",
      url: "/cannabis-cola-bud-close-up.jpg",
      category: "hero",
      tags: ["cola", "bud", "close-up", "cannabis"],
      size: "3.1 MB",
      dimensions: "2560x1440",
      uploadedAt: "2024-01-14T15:45:00Z",
    },
  ])

  const handleImageUpload = (files: File[]) => {
    // In a real implementation, this would upload to cloud storage
    files.forEach((file) => {
      const newImage = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        category: "product",
        tags: [],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        dimensions: "Unknown",
        uploadedAt: new Date().toISOString(),
      }
      setUploadedImages((prev) => [newImage, ...prev])
    })
  }

  const filteredImages = uploadedImages.filter((image) => {
    const matchesSearch =
      image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || image.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-trichome-frost">Image Management</h1>
          <p className="text-gray-400 mt-2">Upload and manage high-resolution cannabis imagery</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="bg-bud-purple hover:bg-bud-purple/80"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="bg-bud-purple hover:bg-bud-purple/80"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="bg-cosmic-black border-leaf-green/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost flex items-center gap-2">
            <Upload className="h-5 w-5 text-leaf-green" />
            Upload Cannabis Imagery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadZone onUpload={handleImageUpload} />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-cosmic-black border-bud-purple/30">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-cosmic-black border-bud-purple/30">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="product">Product Images</SelectItem>
                <SelectItem value="hero">Hero Images</SelectItem>
                <SelectItem value="background">Backgrounds</SelectItem>
                <SelectItem value="macro">Macro Photography</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ImageIcon className="h-4 w-4" />
              <span>{filteredImages.length} images</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <Card className="bg-cosmic-black border-bud-purple/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost">Image Library</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageGallery
            images={filteredImages}
            viewMode={viewMode}
            onImageUpdate={(id, updates) => {
              setUploadedImages((prev) => prev.map((img) => (img.id === id ? { ...img, ...updates } : img)))
            }}
            onImageDelete={(id) => {
              setUploadedImages((prev) => prev.filter((img) => img.id !== id))
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
