"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, ImageIcon, AlertCircle, CheckCircle } from "lucide-react"

interface ImageUploadZoneProps {
  onUpload: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function ImageUploadZone({
  onUpload,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
}: ImageUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [category, setCategory] = useState("product")
  const [tags, setTags] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `${file.name}: Invalid file type. Please use JPEG, PNG, or WebP.`
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `${file.name}: File too large. Maximum size is ${maxSize}MB.`
    }
    return null
  }

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const fileArray = Array.from(files)
      const newErrors: string[] = []
      const validFiles: File[] = []

      if (selectedFiles.length + fileArray.length > maxFiles) {
        newErrors.push(`Maximum ${maxFiles} files allowed`)
        return
      }

      fileArray.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          newErrors.push(error)
        } else {
          validFiles.push(file)
        }
      })

      setErrors(newErrors)
      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles])
      }
    },
    [selectedFiles, maxFiles, maxSize, acceptedTypes],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) return

    onUpload(selectedFiles)
    setSelectedFiles([])
    setTags("")
    setErrors([])
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver ? "border-leaf-green bg-leaf-green/10" : "border-bud-purple/30 hover:border-bud-purple/50"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-bud-purple/20 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-bud-purple" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-trichome-frost mb-2">Upload Cannabis Imagery</h3>
            <p className="text-gray-400 mb-4">Drag and drop high-resolution images or click to browse</p>
            <Input
              type="file"
              multiple
              accept={acceptedTypes.join(",")}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload">
              <Button
                variant="outline"
                className="border-bud-purple/50 text-bud-purple hover:bg-bud-purple/10 bg-transparent"
                asChild
              >
                <span className="cursor-pointer">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Browse Files
                </span>
              </Button>
            </Label>
          </div>
          <div className="text-xs text-gray-400">
            Supports JPEG, PNG, WebP • Max {maxSize}MB per file • Up to {maxFiles} files
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-pistil-orange bg-pistil-orange/10 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-trichome-frost">Selected Files ({selectedFiles.length})</h4>

          <div className="grid gap-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-cosmic-black/50 rounded-lg border border-bud-purple/20"
              >
                <div className="w-12 h-12 bg-bud-purple/20 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-bud-purple" />
                </div>
                <div className="flex-1">
                  <p className="text-trichome-frost font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-pistil-orange hover:bg-pistil-orange/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Upload Settings */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-cosmic-black/30 rounded-lg border border-bud-purple/20">
            <div>
              <Label htmlFor="category" className="text-trichome-frost">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
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
              <Label htmlFor="tags" className="text-trichome-frost">
                Tags (comma separated)
              </Label>
              <Input
                id="tags"
                placeholder="trichomes, macro, purple, cannabis"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
              />
            </div>
          </div>

          <Button onClick={handleUpload} className="w-full bg-leaf-green hover:bg-leaf-green/80 text-cosmic-black">
            <CheckCircle className="w-4 h-4 mr-2" />
            Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  )
}
