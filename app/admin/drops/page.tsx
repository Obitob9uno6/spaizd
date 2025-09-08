import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropsTable } from "@/components/admin/drops-table"
import { Plus, Zap, Clock, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function AdminDropsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: drops } = await supabase
    .from("drops")
    .select(`
      *,
      drop_products (
        *,
        product:products(name, images)
      )
    `)
    .order("created_at", { ascending: false })

  const now = new Date()
  const activeDrops =
    drops?.filter((drop) => {
      const startTime = new Date(drop.start_time)
      const endTime = drop.end_time ? new Date(drop.end_time) : null
      return startTime <= now && (!endTime || endTime > now) && drop.status === "live"
    }).length || 0

  const upcomingDrops = drops?.filter((drop) => new Date(drop.start_time) > now).length || 0
  const totalDrops = drops?.length || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-trichome-frost">Drop Management</h1>
          <p className="text-gray-400 mt-2">Schedule and manage exclusive product drops</p>
        </div>
        <Button asChild className="bg-bud-purple hover:bg-bud-purple/80 text-white">
          <Link href="/admin/drops/new">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Drop
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-cosmic-black border-leaf-green/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Drops</p>
                <p className="text-2xl font-bold text-trichome-frost">{activeDrops}</p>
              </div>
              <Zap className="h-8 w-8 text-leaf-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-amber-glow/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-trichome-frost">{upcomingDrops}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-bud-purple/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Drops</p>
                <p className="text-2xl font-bold text-trichome-frost">{totalDrops}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-bud-purple" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-black border-pistil-orange/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Queue Users</p>
                <p className="text-2xl font-bold text-trichome-frost">247</p>
              </div>
              <Users className="h-8 w-8 text-pistil-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-cosmic-black border-bud-purple/30">
        <CardHeader>
          <CardTitle className="text-trichome-frost">All Drops</CardTitle>
        </CardHeader>
        <CardContent>
          <DropsTable drops={drops || []} />
        </CardContent>
      </Card>
    </div>
  )
}
