"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Download, Copy, Eye, Calendar, HardDrive } from "lucide-react"
import Image from "next/image"

interface ImageData {
  id: string
  name: string
  url: string
  category: string
  tags: string[]
  size: string
  dimensions: string
  uploadedAt: string
}

interface ImageGalleryProps {
  images: ImageData[]
  viewMode: "grid" | "list"
  onImageUpdate: (id: string, updates: Partial<ImageData>) => void
  onImageDelete: (id: string) => void
}

export function ImageGallery({ images, viewMode, onImageUpdate, onImageDelete }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const [editingImage, setEditingImage] = useState<ImageData | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "product":
        return "bg-bud-purple/20 text-bud-purple border-bud-purple/30"
      case "hero":
        return "bg-leaf-green/20 text-leaf-green border-leaf-green/30"
      case "background":
        return "bg-amber-glow/20 text-amber-glow border-amber-glow/30"
      case "macro":
        return "bg-pistil-orange/20 text-pistil-orange border-pistil-orange/30"
      case "lifestyle":
        return "bg-trichome-frost/20 text-trichome-frost border-trichome-frost/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = name
    link.click()
  }

  const handleSaveEdit = () => {
    if (!editingImage) return
    onImageUpdate(editingImage.id, editingImage)
    setEditingImage(null)
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-bud-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-bud-purple" />
        </div>
        <h3 className="text-xl font-semibold text-trichome-frost mb-2">No Images Found</h3>
        <p className="text-gray-400">Upload some high-resolution cannabis imagery to get started.</p>
      </div>
    )
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative bg-cosmic-black/50 rounded-lg border border-bud-purple/20 overflow-hidden"
          >
            <div className="aspect-square relative">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className={getCategoryColor(image.category)}>
                  {image.category}
                </Badge>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedImage(image)}
                    className="bg-cosmic-black/80 text-trichome-frost"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingImage(image)}
                    className="bg-cosmic-black/80 text-trichome-frost"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopyUrl(image.url)}
                    className="bg-cosmic-black/80 text-trichome-frost"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-trichome-frost font-medium truncate">{image.name}</h4>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>{image.size}</span>
                <span>{image.dimensions}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {image.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                    {tag}
                  </Badge>
                ))}
                {image.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                    +{image.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border border-bud-purple/30 bg-cosmic-black/50">
      <Table>
        <TableHeader>
          <TableRow className="border-bud-purple/30">
            <TableHead className="text-trichome-frost">Image</TableHead>
            <TableHead className="text-trichome-frost">Category</TableHead>
            <TableHead className="text-trichome-frost">Size</TableHead>
            <TableHead className="text-trichome-frost">Dimensions</TableHead>
            <TableHead className="text-trichome-frost">Uploaded</TableHead>
            <TableHead className="text-trichome-frost">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images.map((image) => (
            <TableRow key={image.id} className="border-bud-purple/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-bud-purple/30">
                    <Image src={image.url || "/placeholder.svg"} alt={image.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-trichome-frost font-medium">{image.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {image.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getCategoryColor(image.category)}>
                  {image.category}
                </Badge>
              </TableCell>
              <TableCell className="text-trichome-frost">{image.size}</TableCell>
              <TableCell className="text-trichome-frost">{image.dimensions}</TableCell>
              <TableCell className="text-gray-400">{new Date(image.uploadedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(image)}
                    className="text-trichome-frost hover:text-leaf-green"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingImage(image)}
                    className="text-trichome-frost hover:text-bud-purple"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyUrl(image.url)}
                    className="text-trichome-frost hover:text-amber-glow"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(image.url, image.name)}
                    className="text-trichome-frost hover:text-leaf-green"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onImageDelete(image.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Image Preview Dialog
const ImagePreviewDialog = ({
  selectedImage,
  setSelectedImage,
  getCategoryColor,
}: {
  selectedImage: ImageData | null
  setSelectedImage: (image: ImageData | null) => void
  getCategoryColor: (category: string) => string
}) => {
  if (!selectedImage) return null

  return (
    <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
      <DialogContent className="max-w-4xl bg-cosmic-black border-bud-purple/30">
        <DialogHeader>
          <DialogTitle className="text-trichome-frost">{selectedImage.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative aspect-video bg-cosmic-black/50 rounded-lg overflow-hidden">
            <Image
              src={selectedImage.url || "/placeholder.svg"}
              alt={selectedImage.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getCategoryColor(selectedImage.category)}>
                {selectedImage.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <HardDrive className="w-4 h-4" />
              {selectedImage.size}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Eye className="w-4 h-4" />
              {selectedImage.dimensions}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              {new Date(selectedImage.uploadedAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedImage.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="border-gray-600 text-gray-400">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Edit Dialog
const EditDialog = ({
  editingImage,
  setEditingImage,
  handleSaveEdit,
}: {
  editingImage: ImageData | null
  setEditingImage: (image: ImageData | null) => void
  handleSaveEdit: () => void
}) => {
  if (!editingImage) return null

  return (
    <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
      <DialogContent className="bg-cosmic-black border-bud-purple/30">
        <DialogHeader>
          <DialogTitle className="text-trichome-frost">Edit Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name" className="text-trichome-frost">
              Name
            </Label>
            <Input
              id="edit-name"
              value={editingImage.name}
              onChange={(e) => setEditingImage({ ...editingImage, name: e.target.value })}
              className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
            />
          </div>
          <div>
            <Label htmlFor="edit-category" className="text-trichome-frost">
              Category
            </Label>
            <Select
              value={editingImage.category}
              onValueChange={(value) => setEditingImage({ ...editingImage, category: value })}
            >
              <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-cosmic-black border-bud-purple/30">
                <SelectItem value="product">Product Images</SelectItem>
                <SelectItem value="hero">Hero Images</SelectItem>
                <SelectItem value="background">Backgrounds</SelectItem>
                <SelectItem value="macro">Macro Photography</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-tags" className="text-trichome-frost">
              Tags
            </Label>
            <Input
              id="edit-tags"
              value={editingImage.tags.join(", ")}
              onChange={(e) => setEditingImage({ ...editingImage, tags: e.target.value.split(", ").filter(Boolean) })}
              className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
              placeholder="trichomes, macro, purple, cannabis"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingImage(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-bud-purple hover:bg-bud-purple/80">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main Component
export function ImageGalleryWrapper({ images, viewMode, onImageUpdate, onImageDelete }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const [editingImage, setEditingImage] = useState<ImageData | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "product":
        return "bg-bud-purple/20 text-bud-purple border-bud-purple/30"
      case "hero":
        return "bg-leaf-green/20 text-leaf-green border-leaf-green/30"
      case "background":
        return "bg-amber-glow/20 text-amber-glow border-amber-glow/30"
      case "macro":
        return "bg-pistil-orange/20 text-pistil-orange border-pistil-orange/30"
      case "lifestyle":
        return "bg-trichome-frost/20 text-trichome-frost border-trichome-frost/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = name
    link.click()
  }

  const handleSaveEdit = () => {
    if (!editingImage) return
    onImageUpdate(editingImage.id, editingImage)
    setEditingImage(null)
  }

  return (
    <div>
      <ImageGallery images={images} viewMode={viewMode} onImageUpdate={onImageUpdate} onImageDelete={onImageDelete} />
      <ImagePreviewDialog
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        getCategoryColor={getCategoryColor}
      />
      <EditDialog editingImage={editingImage} setEditingImage={setEditingImage} handleSaveEdit={handleSaveEdit} />
    </div>
  )
}
