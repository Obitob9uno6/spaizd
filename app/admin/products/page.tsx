import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductsTable } from "@/components/admin/products-table"
import { Plus } from "lucide-react"
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-2">Manage your product catalog</p>
        </div>
        <Button asChild className="bg-led-green hover:bg-led-green/90 text-black">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsTable products={products || []} />
        </CardContent>
      </Card>
    </div>
  )
}
