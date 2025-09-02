import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { DropDetails } from "@/components/drop-details"
import { QueueSystem } from "@/components/queue-system"

interface DropPageProps {
  params: Promise<{ slug: string }>
}

export default async function DropPage({ params }: DropPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch drop with products and queue info
  const { data: drop } = await supabase
    .from("drops")
    .select(`
      *,
      drop_products(
        *,
        product:products(*),
        variant:product_variants(*)
      )
    `)
    .eq("slug", slug)
    .single()

  if (!drop) {
    notFound()
  }

  // Check if user is authenticated for queue functionality
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's queue position if they're in the queue
  let queuePosition = null
  if (user) {
    const { data: queueData } = await supabase
      .from("drop_queue")
      .select("position, status")
      .eq("drop_id", drop.id)
      .eq("user_id", user.id)
      .single()

    queuePosition = queueData
  }

  const now = new Date()
  const startTime = new Date(drop.start_time)
  const endTime = drop.end_time ? new Date(drop.end_time) : null

  let dropStatus: "upcoming" | "live" | "ended"
  if (startTime > now) {
    dropStatus = "upcoming"
  } else if (!endTime || endTime > now) {
    dropStatus = "live"
  } else {
    dropStatus = "ended"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DropDetails drop={drop} status={dropStatus} />

      {/* Queue System for high-demand drops */}
      {drop.max_quantity && drop.max_quantity <= 100 && dropStatus !== "ended" && (
        <div className="mt-8">
          <QueueSystem drop={drop} user={user} queuePosition={queuePosition} dropStatus={dropStatus} />
        </div>
      )}
    </div>
  )
}
