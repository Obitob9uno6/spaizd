"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploadZone } from "@/components/admin/image-upload-zone"
import { ImageGallery } from "@/components/admin/image-gallery"
import { Upload, ImageIcon, Search, Grid, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageData {
  id: string
  name: string
  original_name: string
  url: string
  category: string
  tags: string[]
  size_bytes: number
  width?: number
  height?: number
  mime_type: string
  created_at: string
  updated_at: string
}

export default function AdminUploadsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const loadImages = async () => {
    try {
      const params = new URLSearchParams()
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      if (searchTerm) params.set("search", searchTerm)

      const response = await fetch(`/api/admin/images?${params}`)
      if (!response.ok) throw new Error("Failed to load images")

      const data = await response.json()
      setImages(data.images || [])
    } catch (error) {
      console.error("Error loading images:", error)
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [categoryFilter, searchTerm])

  const handleImageUpload = async (files: File[], category: string, tags: string) => {
    setUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("category", category)
        formData.append("tags", tags)

        const response = await fetch("/api/admin/images/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        return response.json()
      })

      const results = await Promise.all(uploadPromises)
      const successCount = results.filter((r) => r.success).length

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${successCount} of ${files.length} images`,
      })

      // Reload images
      await loadImages()
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Error",
        description: "Some images failed to upload",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpdate = async (id: string, updates: Partial<ImageData>) => {
    try {
      const response = await fetch(`/api/admin/images/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Failed to update image")

      const data = await response.json()
      setImages((prev) => prev.map((img) => (img.id === id ? data.image : img)))

      toast({
        title: "Success",
        description: "Image updated successfully",
      })
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      })
    }
  }

  const handleImageDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/images/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete image")

      setImages((prev) => prev.filter((img) => img.id !== id))

      toast({
        title: "Success",
        description: "Image deleted successfully",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      })
    }
  }

  const galleryImages = images.map((img) => ({
    id: img.id,
    name: img.original_name,
    url: img.url,
    category: img.category,
    tags: img.tags,
    size: `${(img.size_bytes / 1024 / 1024).toFixed(1)} MB`,
    dimensions: img.width && img.height ? `${img.width}x${img.height}` : "Unknown",
    uploadedAt: img.created_at,
  }))

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
          <ImageUploadZone onUpload={handleImageUpload} uploading={uploading} />
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
              <span>{images.length} images</span>
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading images...</div>
            </div>
          ) : (
            <ImageGallery
              images={galleryImages}
              viewMode={viewMode}
              onImageUpdate={handleImageUpdate}
              onImageDelete={handleImageDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
