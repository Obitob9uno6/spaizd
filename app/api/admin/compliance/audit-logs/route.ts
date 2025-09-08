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

    // Check if user is owner (compliance is owner-only)
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
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const action = searchParams.get("action")
    const resourceType = searchParams.get("resource_type")

    let query = supabase
      .from("audit_logs")
      .select(`
        *,
        user_profiles (email, full_name)
      `)
      .order("created_at", { ascending: false })

    if (action) {
      query = query.eq("action", action)
    }

    if (resourceType) {
      query = query.eq("resource_type", resourceType)
    }

    const { data: logs, error } = await query.range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("Audit logs error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Audit logs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
