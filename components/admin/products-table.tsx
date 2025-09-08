"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Eye, Copy, Archive } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  base_price: number
  status: string
  category: string
  images: string[]
  created_at: string
  product_variants?: Array<{
    id: string
    size: string
    color: string
    price: number
    inventory_count: number
  }>
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-leaf-green text-cosmic-black"
      case "draft":
        return "bg-amber-glow text-cosmic-black"
      case "archived":
        return "bg-pistil-orange text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getInventoryStatus = (variants: Product["product_variants"]) => {
    if (!variants || variants.length === 0) return { status: "unknown", count: 0 }

    const totalInventory = variants.reduce((sum, v) => sum + v.inventory_count, 0)
    const lowStock = totalInventory < 20
    const outOfStock = totalInventory === 0

    return {
      status: outOfStock ? "out" : lowStock ? "low" : "good",
      count: totalInventory,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-cosmic-black border-bud-purple/30">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-cosmic-black border-bud-purple/30">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="tshirts">T-Shirts</SelectItem>
            <SelectItem value="hoodies">Hoodies</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="hats">Hats</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-bud-purple/30 bg-cosmic-black/50">
        <Table>
          <TableHeader>
            <TableRow className="border-bud-purple/30">
              <TableHead className="text-trichome-frost">Product</TableHead>
              <TableHead className="text-trichome-frost">Category</TableHead>
              <TableHead className="text-trichome-frost">Price</TableHead>
              <TableHead className="text-trichome-frost">Status</TableHead>
              <TableHead className="text-trichome-frost">Inventory</TableHead>
              <TableHead className="text-trichome-frost">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const inventoryStatus = getInventoryStatus(product.product_variants)

              return (
                <TableRow key={product.id} className="border-bud-purple/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-bud-purple/30">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=48&width=48&query=cannabis product"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-trichome-frost font-medium">{product.name}</p>
                        <p className="text-gray-400 text-sm truncate max-w-xs">{product.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-amber-glow/30 text-amber-glow">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-trichome-frost">${product.base_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-trichome-frost">{inventoryStatus.count}</span>
                      {inventoryStatus.status === "low" && (
                        <Badge variant="outline" className="border-pistil-orange/30 text-pistil-orange text-xs">
                          Low
                        </Badge>
                      )}
                      {inventoryStatus.status === "out" && (
                        <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs">
                          Out
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button asChild variant="ghost" size="sm" className="text-trichome-frost hover:text-leaf-green">
                        <Link href={`/admin/products/${product.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="text-trichome-frost hover:text-bud-purple">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-trichome-frost hover:text-amber-glow">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-trichome-frost hover:text-pistil-orange">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No products found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
