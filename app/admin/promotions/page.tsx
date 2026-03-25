import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Users } from "lucide-react"
import Link from "next/link"

export default async function PromotionsPage() {
  const supabase = await createClient()

  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: coupons } = await supabase
    .from("coupons")
    .select("*, _count:coupon_usages(count)")
    .order("created_at", { ascending: false })

  const activePromotions = promotions?.filter((p) => {
    const now = new Date()
    const start = new Date(p.start_date)
    const end = p.end_date ? new Date(p.end_date) : null
    return start <= now && (!end || end > now) && p.status === "active"
  }).length || 0

  const activeCoupons = coupons?.filter((c) => {
    const now = new Date()
    const start = new Date(c.start_date)
    const end = c.expiry_date ? new Date(c.expiry_date) : null
    return start <= now && (!end || end > now) && c.status === "active"
  }).length || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-trichome-frost">Promotions & Coupons</h1>
          <p className="text-gray-400 mt-2">Manage discounts, promotions, and coupon codes</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-leaf-green hover:bg-leaf-green/80 text-cosmic-black">
            <Link href="/admin/promotions/coupons/new">
              <Plus className="h-4 w-4 mr-2" />
              New Coupon
            </Link>
          </Button>
          <Button asChild className="bg-bud-purple hover:bg-bud-purple/80 text-white">
            <Link href="/admin/promotions/new">
              <Plus className="h-4 w-4 mr-2" />
              New Promotion
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Promotions</p>
              <p className="text-2xl font-bold text-trichome-frost">{activePromotions}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-bud-purple" />
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-leaf-green/30">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Coupons</p>
              <p className="text-2xl font-bold text-trichome-frost">{activeCoupons}</p>
            </div>
            <DollarSign className="h-8 w-8 text-leaf-green" />
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-amber-glow/30">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Coupons</p>
              <p className="text-2xl font-bold text-trichome-frost">{coupons?.length || 0}</p>
            </div>
            <Users className="h-8 w-8 text-amber-glow" />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Promotions */}
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost">Active Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            {promotions && promotions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-bud-purple/30">
                    <TableHead className="text-trichome-frost">Name</TableHead>
                    <TableHead className="text-trichome-frost">Discount</TableHead>
                    <TableHead className="text-trichome-frost">Status</TableHead>
                    <TableHead className="text-trichome-frost">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promo: any) => {
                    const now = new Date()
                    const start = new Date(promo.start_date)
                    const end = promo.end_date ? new Date(promo.end_date) : null
                    const isActive = start <= now && (!end || end > now) && promo.status === "active"

                    return (
                      <TableRow key={promo.id} className="border-bud-purple/30">
                        <TableCell className="text-trichome-frost font-medium">{promo.name}</TableCell>
                        <TableCell className="text-trichome-frost">{promo.discount_type === "percentage" ? `${promo.discount_value}%` : `$${promo.discount_value}`}</TableCell>
                        <TableCell>
                          <Badge className={isActive ? "bg-leaf-green text-cosmic-black" : "bg-gray-500 text-white"}>
                            {isActive ? "Active" : promo.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button asChild size="sm" variant="outline" className="border-bud-purple/30 text-bud-purple hover:bg-bud-purple/10 bg-transparent h-7">
                            <Link href={`/admin/promotions/${promo.id}`}><Edit className="h-3 w-3" /></Link>
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent h-7">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-400 text-center py-4">No promotions yet</p>
            )}
          </CardContent>
        </Card>

        {/* Coupons */}
        <Card className="bg-cosmic-black border-leaf-green/30">
          <CardHeader>
            <CardTitle className="text-trichome-frost">Active Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            {coupons && coupons.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-leaf-green/30">
                    <TableHead className="text-trichome-frost">Code</TableHead>
                    <TableHead className="text-trichome-frost">Discount</TableHead>
                    <TableHead className="text-trichome-frost">Status</TableHead>
                    <TableHead className="text-trichome-frost">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon: any) => {
                    const now = new Date()
                    const start = new Date(coupon.start_date)
                    const end = coupon.expiry_date ? new Date(coupon.expiry_date) : null
                    const isActive = start <= now && (!end || end > now) && coupon.status === "active"

                    return (
                      <TableRow key={coupon.id} className="border-leaf-green/30">
                        <TableCell className="text-trichome-frost font-mono font-medium">{coupon.code}</TableCell>
                        <TableCell className="text-trichome-frost">{coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}</TableCell>
                        <TableCell>
                          <Badge className={isActive ? "bg-leaf-green text-cosmic-black" : "bg-gray-500 text-white"}>
                            {isActive ? "Active" : coupon.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button asChild size="sm" variant="outline" className="border-leaf-green/30 text-leaf-green hover:bg-leaf-green/10 bg-transparent h-7">
                            <Link href={`/admin/promotions/coupons/${coupon.id}`}><Edit className="h-3 w-3" /></Link>
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent h-7">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-400 text-center py-4">No coupons yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
