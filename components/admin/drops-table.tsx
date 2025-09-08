"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Eye, Copy, Play, Pause, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Drop {
  id: string
  name: string
  slug: string
  description: string
  type: string
  status: string
  start_time: string
  end_time?: string
  max_quantity?: number
  images: string[]
  created_at: string
  drop_products?: Array<{
    id: string
    quantity_available: number
    quantity_sold: number
    drop_price_cents: number
    product: {
      name: string
      images: string[]
    }
  }>
}

interface DropsTableProps {
  drops: Drop[]
}

export function DropsTable({ drops }: DropsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredDrops = drops.filter((drop) => {
    const matchesSearch =
      drop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drop.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || drop.status === statusFilter
    const matchesType = typeFilter === "all" || drop.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-leaf-green text-cosmic-black"
      case "scheduled":
        return "bg-amber-glow text-cosmic-black"
      case "draft":
        return "bg-gray-500 text-white"
      case "ended":
        return "bg-pistil-orange text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "limited":
        return "bg-bud-purple/20 text-bud-purple border-bud-purple/30"
      case "collab":
        return "bg-amber-glow/20 text-amber-glow border-amber-glow/30"
      case "seasonal":
        return "bg-leaf-green/20 text-leaf-green border-leaf-green/30"
      case "exclusive":
        return "bg-pistil-orange/20 text-pistil-orange border-pistil-orange/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getDropStatus = (drop: Drop) => {
    const now = new Date()
    const startTime = new Date(drop.start_time)
    const endTime = drop.end_time ? new Date(drop.end_time) : null

    if (drop.status === "draft") return "draft"
    if (startTime > now) return "scheduled"
    if (!endTime || endTime > now) return "live"
    return "ended"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search drops..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-cosmic-black border-bud-purple/30">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="limited">Limited</SelectItem>
            <SelectItem value="collab">Collaboration</SelectItem>
            <SelectItem value="seasonal">Seasonal</SelectItem>
            <SelectItem value="exclusive">Exclusive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-bud-purple/30 bg-cosmic-black/50">
        <Table>
          <TableHeader>
            <TableRow className="border-bud-purple/30">
              <TableHead className="text-trichome-frost">Drop</TableHead>
              <TableHead className="text-trichome-frost">Type</TableHead>
              <TableHead className="text-trichome-frost">Status</TableHead>
              <TableHead className="text-trichome-frost">Schedule</TableHead>
              <TableHead className="text-trichome-frost">Products</TableHead>
              <TableHead className="text-trichome-frost">Sales</TableHead>
              <TableHead className="text-trichome-frost">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrops.map((drop) => {
              const actualStatus = getDropStatus(drop)
              const totalProducts = drop.drop_products?.length || 0
              const totalSold = drop.drop_products?.reduce((sum, dp) => sum + dp.quantity_sold, 0) || 0
              const totalRevenue =
                drop.drop_products?.reduce((sum, dp) => sum + (dp.quantity_sold * dp.drop_price_cents) / 100, 0) || 0

              return (
                <TableRow key={drop.id} className="border-bud-purple/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-bud-purple/30">
                        <Image
                          src={
                            drop.images[0] ||
                            drop.drop_products?.[0]?.product.images[0] ||
                            "/placeholder.svg?height=48&width=48&query=cannabis drop"
                          }
                          alt={drop.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-trichome-frost font-medium">{drop.name}</p>
                        <p className="text-gray-400 text-sm truncate max-w-xs">{drop.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(drop.type)}>
                      {drop.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(actualStatus)}>{actualStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-trichome-frost">{new Date(drop.start_time).toLocaleDateString()}</div>
                      <div className="text-gray-400">
                        {new Date(drop.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-trichome-frost">{totalProducts}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-trichome-frost font-medium">${totalRevenue.toFixed(2)}</div>
                      <div className="text-gray-400">{totalSold} sold</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button asChild variant="ghost" size="sm" className="text-trichome-frost hover:text-leaf-green">
                        <Link href={`/admin/drops/${drop.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="text-trichome-frost hover:text-bud-purple">
                        <Link href={`/admin/drops/${drop.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-trichome-frost hover:text-amber-glow">
                        <Copy className="h-4 w-4" />
                      </Button>
                      {actualStatus === "scheduled" && (
                        <Button variant="ghost" size="sm" className="text-trichome-frost hover:text-leaf-green">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {actualStatus === "live" && (
                        <Button variant="ghost" size="sm" className="text-trichome-frost hover:text-pistil-orange">
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
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

      {filteredDrops.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No drops found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
