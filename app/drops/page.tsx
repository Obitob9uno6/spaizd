import { createClient } from "@/lib/supabase/server"
import { DropCard } from "@/components/drop-card"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, Users } from "lucide-react"

export default async function DropsPage() {
  const supabase = await createClient()

  // Fetch drops with their products
  const { data: drops } = await supabase
    .from("drops")
    .select(`
      *,
      drop_products(
        *,
        product:products(*),
        variant:product_variants(*)
      )
    `)
    .order("start_time", { ascending: true })

  const now = new Date()
  const upcomingDrops = drops?.filter((drop) => new Date(drop.start_time) > now) || []
  const liveDrops =
    drops?.filter((drop) => {
      const startTime = new Date(drop.start_time)
      const endTime = drop.end_time ? new Date(drop.end_time) : null
      return startTime <= now && (!endTime || endTime > now) && drop.status === "live"
    }) || []
  const endedDrops =
    drops?.filter((drop) => {
      const endTime = drop.end_time ? new Date(drop.end_time) : null
      return (endTime && endTime <= now) || drop.status === "ended"
    }) || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Exclusive Drops</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Limited edition releases, exclusive colorways, and special collaborations. Get them before they're gone
          forever.
        </p>
      </div>

      {/* Live Drops */}
      {liveDrops.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-secondary text-secondary-foreground">
              <Zap className="w-4 h-4 mr-2" />
              Live Now
            </Badge>
            <h2 className="text-2xl font-bold">Available Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveDrops.map((drop) => (
              <DropCard key={drop.id} drop={drop} status="live" />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Drops */}
      {upcomingDrops.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Coming Soon
            </Badge>
            <h2 className="text-2xl font-bold">Upcoming Drops</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingDrops.map((drop) => (
              <DropCard key={drop.id} drop={drop} status="upcoming" />
            ))}
          </div>
        </section>
      )}

      {/* Ended Drops */}
      {endedDrops.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="secondary">
              <Users className="w-4 h-4 mr-2" />
              Past Drops
            </Badge>
            <h2 className="text-2xl font-bold">Previous Releases</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endedDrops.slice(0, 6).map((drop) => (
              <DropCard key={drop.id} drop={drop} status="ended" />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!liveDrops.length && !upcomingDrops.length && !endedDrops.length && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Drops Available</h3>
          <p className="text-muted-foreground">Check back soon for exclusive releases and limited drops.</p>
        </div>
      )}
    </div>
  )
}
