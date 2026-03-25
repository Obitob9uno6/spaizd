import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Calendar, Users, Package } from "lucide-react"
import Link from "next/link"

export default async function DropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: drop } = await supabase
    .from("drops")
    .select(`
      *,
      drop_products (
        *,
        product:products(id, name, images)
      )
    `)
    .eq("id", id)
    .single()

  if (!drop) notFound()

  const now = new Date()
  const startTime = new Date(drop.start_time)
  const endTime = drop.end_time ? new Date(drop.end_time) : null
  const isActive = startTime <= now && (!endTime || endTime > now) && drop.status === "live"
  const isUpcoming = startTime > now
  const isEnded = endTime && endTime <= now

  const statusColor: Record<string, string> = {
    live: "bg-leaf-green text-cosmic-black",
    scheduled: "bg-amber-glow text-cosmic-black",
    ended: "bg-gray-500 text-white",
    draft: "bg-bud-purple text-white",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm" className="border-bud-purple/30 text-trichome-frost hover:bg-bud-purple/20 bg-transparent">
            <Link href="/admin/drops"><ArrowLeft className="w-4 h-4 mr-2" />Drops</Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-trichome-frost">{drop.title}</h1>
            <Badge className={statusColor[drop.status] ?? "bg-gray-500 text-white"} style={{ marginTop: "8px" }}>{drop.status}</Badge>
          </div>
        </div>
        <Button asChild className="bg-bud-purple hover:bg-bud-purple/80 text-white">
          <Link href={`/admin/drops/${id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit Drop</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-xl font-bold text-trichome-frost mt-1">
                {isActive ? "Active Now" : isUpcoming ? "Upcoming" : isEnded ? "Ended" : "Draft"}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-bud-purple" />
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-leaf-green/30">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Products</p>
              <p className="text-2xl font-bold text-trichome-frost">{drop.drop_products?.length || 0}</p>
            </div>
            <Package className="h-8 w-8 text-leaf-green" />
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-amber-glow/30">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Queue Users</p>
              <p className="text-2xl font-bold text-trichome-frost">0</p>
            </div>
            <Users className="h-8 w-8 text-amber-glow" />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-cosmic-black border-bud-purple/30">
            <CardHeader><CardTitle className="text-trichome-frost">Drop Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Starts</p>
                <p className="text-trichome-frost font-mono">{new Date(drop.start_time).toLocaleString()}</p>
              </div>
              {drop.end_time && (
                <div>
                  <p className="text-gray-400">Ends</p>
                  <p className="text-trichome-frost font-mono">{new Date(drop.end_time).toLocaleString()}</p>
                </div>
              )}
              {drop.description && (
                <div className="pt-2 border-t border-bud-purple/20">
                  <p className="text-gray-400 mb-1">Description</p>
                  <p className="text-trichome-frost leading-relaxed">{drop.description}</p>
                </div>
              )}
              {drop.featured_image && (
                <div className="pt-2 border-t border-bud-purple/20">
                  <p className="text-gray-400 mb-1">Featured Image</p>
                  <p className="text-trichome-frost text-xs break-all">{drop.featured_image}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-cosmic-black border-bud-purple/30">
            <CardHeader><CardTitle className="text-trichome-frost">Products in Drop</CardTitle></CardHeader>
            <CardContent>
              {drop.drop_products?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-bud-purple/30">
                      <TableHead className="text-trichome-frost">Product</TableHead>
                      <TableHead className="text-trichome-frost">Quantity Available</TableHead>
                      <TableHead className="text-trichome-frost">Queue Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drop.drop_products.map((dp: any, idx: number) => (
                      <TableRow key={dp.id} className="border-bud-purple/30">
                        <TableCell className="text-trichome-frost font-medium">{dp.product?.name || "Unknown"}</TableCell>
                        <TableCell className="text-trichome-frost">{dp.quantity_available || "Unlimited"}</TableCell>
                        <TableCell className="text-gray-400">{idx + 1}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No products in this drop yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
