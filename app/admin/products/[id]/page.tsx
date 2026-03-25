import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Plus, Package, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { deleteProduct } from "../actions"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .single()

  if (!product) notFound()

  const totalInventory = product.product_variants?.reduce((s: number, v: { inventory_count: number }) => s + v.inventory_count, 0) ?? 0
  const totalVariants = product.product_variants?.length ?? 0
  const avgPrice =
    totalVariants > 0
      ? (product.product_variants?.reduce((s: number, v: { price: number }) => s + v.price, 0) ?? 0) / totalVariants
      : product.base_price

  const statusColor: Record<string, string> = {
    active: "bg-leaf-green text-cosmic-black",
    draft: "bg-amber-glow text-cosmic-black",
    archived: "bg-pistil-orange text-white",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm" className="border-bud-purple/30 text-trichome-frost hover:bg-bud-purple/20 bg-transparent">
            <Link href="/admin/products"><ArrowLeft className="w-4 h-4 mr-2" />Products</Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-trichome-frost">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColor[product.status] ?? "bg-gray-500 text-white"}>{product.status}</Badge>
              <Badge variant="outline" className="border-amber-glow/30 text-amber-glow">{product.category}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-bud-purple hover:bg-bud-purple/80 text-white">
            <Link href={`/admin/products/${id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit Product</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Base Price</p>
              <p className="text-2xl font-bold text-trichome-frost">${product.base_price.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-bud-purple" />
          </CardContent>
        </Card>
        <Card className="bg-cosmic-black border-leaf-green/30">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Inventory</p>
              <p className="text-2xl font-bold text-trichome-frost">{totalInventory}</p>
            </div>
            <Package className="h-8 w-8 text-leaf-green" />
          </CardContent>
        </Card>
        <Card className={`bg-cosmic-black ${totalInventory < 20 ? "border-pistil-orange/30" : "border-gray-700"}`}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Variants</p>
              <p className="text-2xl font-bold text-trichome-frost">{totalVariants}</p>
            </div>
            <AlertTriangle className={`h-8 w-8 ${totalInventory < 20 ? "text-pistil-orange" : "text-gray-500"}`} />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-cosmic-black border-bud-purple/30">
            <CardHeader><CardTitle className="text-trichome-frost">Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Brand</span><span className="text-trichome-frost">{product.brand || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Category</span><span className="text-trichome-frost capitalize">{product.category}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Base Price</span><span className="text-trichome-frost">${product.base_price.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Avg. Variant Price</span><span className="text-trichome-frost">${avgPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Created</span><span className="text-trichome-frost">{new Date(product.created_at).toLocaleDateString()}</span></div>
              {product.description && (
                <div className="pt-2 border-t border-bud-purple/20">
                  <p className="text-gray-400 mb-1">Description</p>
                  <p className="text-trichome-frost leading-relaxed">{product.description}</p>
                </div>
              )}
              {product.tags?.length > 0 && (
                <div className="pt-2 border-t border-bud-purple/20">
                  <p className="text-gray-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag: string) => (
                      <Badge key={tag} className="bg-amber-glow/20 text-amber-glow border-amber-glow/30 text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          {product.images?.length > 0 && (
            <Card className="bg-cosmic-black border-bud-purple/30">
              <CardHeader><CardTitle className="text-trichome-frost">Images</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {product.images.map((img: string, i: number) => (
                  <div key={i} className="p-2 bg-cosmic-black/50 rounded border border-bud-purple/20 text-xs text-gray-400 break-all">{img}</div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          <Card className="bg-cosmic-black border-red-500/30">
            <CardHeader><CardTitle className="text-red-400">Danger Zone</CardTitle></CardHeader>
            <CardContent>
              <form action={deleteProduct.bind(null, id)}>
                <Button type="submit" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent w-full">
                  Delete Product
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Variants */}
        <div className="lg:col-span-2">
          <Card className="bg-cosmic-black border-bud-purple/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-trichome-frost">Variants & Inventory</CardTitle>
              <Button asChild size="sm" className="bg-bud-purple hover:bg-bud-purple/80 text-white">
                <Link href={`/admin/products/${id}/edit`}><Plus className="h-4 w-4 mr-1" />Add Variant</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {product.product_variants?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-bud-purple/30">
                      <TableHead className="text-trichome-frost">Size</TableHead>
                      <TableHead className="text-trichome-frost">Color</TableHead>
                      <TableHead className="text-trichome-frost">SKU</TableHead>
                      <TableHead className="text-trichome-frost">Price</TableHead>
                      <TableHead className="text-trichome-frost">Inventory</TableHead>
                      <TableHead className="text-trichome-frost">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.product_variants.map((v: { id: string; size: string; color: string; sku: string; price: number; inventory_count: number }) => (
                      <TableRow key={v.id} className="border-bud-purple/30">
                        <TableCell className="text-trichome-frost font-medium">{v.size}</TableCell>
                        <TableCell className="text-trichome-frost">{v.color || "—"}</TableCell>
                        <TableCell className="text-gray-400 text-xs font-mono">{v.sku}</TableCell>
                        <TableCell className="text-trichome-frost">${v.price.toFixed(2)}</TableCell>
                        <TableCell className="text-trichome-frost">{v.inventory_count}</TableCell>
                        <TableCell>
                          {v.inventory_count === 0 ? (
                            <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs">Out of Stock</Badge>
                          ) : v.inventory_count < 10 ? (
                            <Badge variant="outline" className="border-pistil-orange/30 text-pistil-orange text-xs">Low Stock</Badge>
                          ) : (
                            <Badge variant="outline" className="border-leaf-green/30 text-leaf-green text-xs">In Stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No variants yet. Edit the product to add variants.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
