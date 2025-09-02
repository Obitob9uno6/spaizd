import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"

export default async function ShopPage() {
  const supabase = await createClient()

  // Fetch products and categories
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `)
      .eq("is_active", true),
    supabase.from("categories").select("*").order("sort_order"),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shop All Products</h1>
        <p className="text-muted-foreground">Discover our complete collection of premium cannabis streetwear.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <CategoryFilter categories={categories || []} />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid products={products || []} />
        </div>
      </div>
    </div>
  )
}
