import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductsTable } from "@/components/admin/products-table"
import { Plus, Package, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function AdminProductsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      product_variants (*)
    `)
    .order("created_at", { ascending: false })

  const totalProducts = products?.length || 0
  const activeProducts = products?.filter((p) => p.status === "active").length || 0
  const lowStockProducts = products?.filter((p) => p.product_variants?.some((v) => v.inventory_count < 10)).length || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-trichome-frost">Product Management</h1>
          <p className="text-gray-400 mt-2">Manage your cannabis apparel catalog</p>
        </div>
        <Button asChild className="bg-bud-purple hover:bg-bud-purple/80 text-white">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-trichome-frost">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-bud-purple" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-leaf-green/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Products</p>
                <p className="text-2xl font-bold text-trichome-frost">{activeProducts}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-leaf-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-pistil-orange/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Low Stock Alert</p>
                <p className="text-2xl font-bold text-trichome-frost">{lowStockProducts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-pistil-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-cosmic-black border-bud-purple/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost">All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsTable products={products || []} />
        </CardContent>
      </Card>
    </div>
  )
}
