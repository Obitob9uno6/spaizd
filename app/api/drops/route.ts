import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "live"

    const { data: drops, error } = await supabase
      .from("drops")
      .select(`
        *,
        drop_products(
          id,
          drop_price_cents,
          quantity_available,
          quantity_sold,
          max_per_customer,
          product:products(
            id,
            name,
            slug,
            description,
            images,
            variants:product_variants(*)
          )
        )
      `)
      .eq("status", status)
      .order("start_time", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch drops" }, { status: 500 })
    }

    return NextResponse.json({ drops })
  } catch (error) {
    console.error("Drops API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}