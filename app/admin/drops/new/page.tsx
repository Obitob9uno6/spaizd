"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Calendar, Zap, Plus, X, Settings } from "lucide-react"
import Link from "next/link"

export default function NewDropPage() {
  const [dropProducts, setDropProducts] = useState([{ productId: "", variantId: "", quantity: "", price: "" }])
  const [gatedAccess, setGatedAccess] = useState(false)
  const [queueEnabled, setQueueEnabled] = useState(false)
  const [vipEarlyAccess, setVipEarlyAccess] = useState(false)

  const addDropProduct = () => {
    setDropProducts([...dropProducts, { productId: "", variantId: "", quantity: "", price: "" }])
  }

  const removeDropProduct = (index: number) => {
    setDropProducts(dropProducts.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-cosmic-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-bud-purple/30 text-trichome-frost hover:bg-bud-purple/20 bg-transparent"
            >
              <Link href="/admin/drops">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Drops
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-trichome-frost">Schedule New Drop</h1>
          </div>

          <form className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-cosmic-black border-bud-purple/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost flex items-center gap-2">
                  <Zap className="h-5 w-5 text-bud-purple" />
                  Drop Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-trichome-frost">
                      Drop Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Summer Collection Drop"
                      className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-trichome-frost">
                      URL Slug
                    </Label>
                    <Input
                      id="slug"
                      placeholder="summer-collection-2024"
                      className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-trichome-frost">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this exclusive drop..."
                    className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost min-h-[120px]"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="type" className="text-trichome-frost">
                      Drop Type
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-black border-bud-purple/30">
                        <SelectItem value="limited">Limited Edition</SelectItem>
                        <SelectItem value="collab">Collaboration</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="max_quantity" className="text-trichome-frost">
                      Max Quantity (Optional)
                    </Label>
                    <Input
                      id="max_quantity"
                      type="number"
                      placeholder="100"
                      className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduling */}
            <Card className="bg-cosmic-black border-amber-glow/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-glow" />
                  Drop Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="start_date" className="text-trichome-frost">
                      Start Date
                    </Label>
                    <Input
                      id="start_date"
                      type="datetime-local"
                      className="bg-cosmic-black/50 border-amber-glow/30 text-trichome-frost"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date" className="text-trichome-frost">
                      End Date (Optional)
                    </Label>
                    <Input
                      id="end_date"
                      type="datetime-local"
                      className="bg-cosmic-black/50 border-amber-glow/30 text-trichome-frost"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-cosmic-black/50 rounded-lg border border-amber-glow/20">
                    <div>
                      <Label className="text-trichome-frost font-medium">VIP Early Access</Label>
                      <p className="text-gray-400 text-sm">Give VIP members 24-hour early access</p>
                    </div>
                    <Switch checked={vipEarlyAccess} onCheckedChange={setVipEarlyAccess} />
                  </div>

                  {vipEarlyAccess && (
                    <div className="ml-4 p-4 bg-amber-glow/10 rounded-lg border border-amber-glow/20">
                      <Label htmlFor="vip_start" className="text-trichome-frost">
                        VIP Start Time
                      </Label>
                      <Input
                        id="vip_start"
                        type="datetime-local"
                        className="bg-cosmic-black/50 border-amber-glow/30 text-trichome-frost mt-2"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card className="bg-cosmic-black border-leaf-green/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost flex items-center gap-2">
                  <Settings className="h-5 w-5 text-leaf-green" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-cosmic-black/50 rounded-lg border border-leaf-green/20">
                    <div>
                      <Label className="text-trichome-frost font-medium">Gated Access</Label>
                      <p className="text-gray-400 text-sm">Require authentication to view drop</p>
                    </div>
                    <Switch checked={gatedAccess} onCheckedChange={setGatedAccess} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-cosmic-black/50 rounded-lg border border-leaf-green/20">
                    <div>
                      <Label className="text-trichome-frost font-medium">Queue System</Label>
                      <p className="text-gray-400 text-sm">Enable queue for high-demand drops</p>
                    </div>
                    <Switch checked={queueEnabled} onCheckedChange={setQueueEnabled} />
                  </div>

                  {queueEnabled && (
                    <div className="ml-4 p-4 bg-leaf-green/10 rounded-lg border border-leaf-green/20">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="queue_limit" className="text-trichome-frost">
                            Queue Size Limit
                          </Label>
                          <Input
                            id="queue_limit"
                            type="number"
                            placeholder="1000"
                            className="bg-cosmic-black/50 border-leaf-green/30 text-trichome-frost mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="purchase_window" className="text-trichome-frost">
                            Purchase Window (minutes)
                          </Label>
                          <Input
                            id="purchase_window"
                            type="number"
                            placeholder="10"
                            defaultValue="10"
                            className="bg-cosmic-black/50 border-leaf-green/30 text-trichome-frost mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Drop Products */}
            <Card className="bg-cosmic-black border-bud-purple/30">
              <CardHeader>
                <CardTitle className="text-trichome-frost">Drop Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dropProducts.map((product, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-5 gap-4 items-end p-4 bg-cosmic-black/50 rounded-lg border border-bud-purple/20"
                  >
                    <div>
                      <Label className="text-trichome-frost">Product</Label>
                      <Select>
                        <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-black border-bud-purple/30">
                          <SelectItem value="tee-1">Cosmic Tee</SelectItem>
                          <SelectItem value="hoodie-1">Nebula Hoodie</SelectItem>
                          <SelectItem value="hat-1">Galaxy Snapback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-trichome-frost">Variant</Label>
                      <Select>
                        <SelectTrigger className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost">
                          <SelectValue placeholder="Select variant" />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-black border-bud-purple/30">
                          <SelectItem value="s-black">S - Black</SelectItem>
                          <SelectItem value="m-black">M - Black</SelectItem>
                          <SelectItem value="l-black">L - Black</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-trichome-frost">Quantity</Label>
                      <Input
                        type="number"
                        placeholder="50"
                        value={product.quantity}
                        onChange={(e) => {
                          const newProducts = [...dropProducts]
                          newProducts[index].quantity = e.target.value
                          setDropProducts(newProducts)
                        }}
                        className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                      />
                    </div>
                    <div>
                      <Label className="text-trichome-frost">Drop Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="29.99"
                        value={product.price}
                        onChange={(e) => {
                          const newProducts = [...dropProducts]
                          newProducts[index].price = e.target.value
                          setDropProducts(newProducts)
                        }}
                        className="bg-cosmic-black/50 border-bud-purple/30 text-trichome-frost"
                      />
                    </div>
                    <div>
                      {dropProducts.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDropProduct(index)}
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
                  onClick={addDropProduct}
                  className="border-bud-purple/50 text-bud-purple hover:bg-bud-purple/10 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
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
              <Button className="bg-bud-purple hover:bg-bud-purple/80 text-white">Schedule Drop</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
