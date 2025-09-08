import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Check if user is owner
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

    if (!profile || profile.role !== "owner") {
      return NextResponse.json({ error: "Forbidden - Owner access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const resolved = searchParams.get("resolved")

    let query = supabase.from("compliance_alerts").select("*").order("created_at", { ascending: false })

    if (resolved !== null) {
      query = query.eq("is_resolved", resolved === "true")
    }

    const { data: alerts, error } = await query

    if (error) {
      console.error("Compliance alerts error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Compliance alerts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
