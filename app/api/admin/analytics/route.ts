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

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

    if (!profile || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Fetch analytics data in parallel
    const [
      { data: revenueData },
      { data: orderData },
      { data: productData },
      { data: dropData },
      { data: userGrowth },
      { data: topProducts },
      { data: vipData },
    ] = await Promise.all([
      // Revenue over time
      supabase
        .from("orders")
        .select("total_cents, created_at")
        .eq("status", "paid")
        .gte("created_at", startDate.toISOString())
        .order("created_at"),

      // Order metrics
      supabase
        .from("orders")
        .select("id, status, created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at"),

      // Product performance
      supabase
        .from("order_items")
        .select(`
          quantity,
          total_price_cents,
          product_id,
          products (name, category)
        `)
        .gte("created_at", startDate.toISOString()),

      // Drop performance
      supabase
        .from("drops")
        .select(`
          id,
          name,
          status,
          start_time,
          end_time,
          drop_products (quantity_available, quantity_sold)
        `)
        .gte("created_at", startDate.toISOString()),

      // User growth
      supabase
        .from("user_profiles")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at"),

      // Top selling products
      supabase
        .from("order_items")
        .select(`
          quantity,
          total_price_cents,
          products (id, name)
        `)
        .gte("created_at", startDate.toISOString()),

      // VIP metrics
      supabase
        .from("vip_memberships")
        .select(`
          status,
          created_at,
          vip_tiers (name, price_cents)
        `)
        .gte("created_at", startDate.toISOString()),
    ])

    // Process revenue data by day
    const revenueByDay = processTimeSeriesData(revenueData || [], "total_cents", period)

    // Process order data
    const ordersByDay = processTimeSeriesData(orderData || [], "count", period)
    const ordersByStatus = processOrdersByStatus(orderData || [])

    // Process product performance
    const productPerformance = processProductPerformance(productData || [])
    const topSellingProducts = processTopProducts(topProducts || [])

    // Process drop performance
    const dropPerformance = processDropPerformance(dropData || [])

    // Process user growth
    const userGrowthData = processTimeSeriesData(userGrowth || [], "count", period)

    // Process VIP data
    const vipMetrics = processVipMetrics(vipData || [])

    // Calculate key metrics
    const totalRevenue = (revenueData || []).reduce((sum, order) => sum + order.total_cents, 0)
    const totalOrders = orderData?.length || 0
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const conversionRate = calculateConversionRate(userGrowth?.length || 0, totalOrders)

    return NextResponse.json({
      summary: {
        totalRevenue: totalRevenue / 100, // Convert cents to dollars
        totalOrders,
        avgOrderValue: avgOrderValue / 100,
        conversionRate,
      },
      charts: {
        revenueByDay,
        ordersByDay,
        ordersByStatus,
        productPerformance,
        topSellingProducts,
        dropPerformance,
        userGrowthData,
        vipMetrics,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper functions
function processTimeSeriesData(data: any[], valueKey: string, period: string) {
  const groupedData = new Map()
  const format = period === "7d" || period === "30d" ? "daily" : period === "90d" ? "weekly" : "monthly"

  data.forEach((item) => {
    const date = new Date(item.created_at)
    let key: string

    if (format === "daily") {
      key = date.toISOString().split("T")[0]
    } else if (format === "weekly") {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      key = weekStart.toISOString().split("T")[0]
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    }

    if (!groupedData.has(key)) {
      groupedData.set(key, { date: key, value: 0, count: 0 })
    }

    const entry = groupedData.get(key)
    if (valueKey === "count") {
      entry.count += 1
      entry.value = entry.count
    } else {
      entry.value += item[valueKey] || 0
    }
  })

  return Array.from(groupedData.values()).sort((a, b) => a.date.localeCompare(b.date))
}

function processOrdersByStatus(orders: any[]) {
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round(((count as number) / orders.length) * 100),
  }))
}

function processProductPerformance(orderItems: any[]) {
  const productMap = new Map()

  orderItems.forEach((item) => {
    const productId = item.product_id
    if (!productMap.has(productId)) {
      productMap.set(productId, {
        id: productId,
        name: item.products?.name || "Unknown",
        category: item.products?.category || "Unknown",
        totalSold: 0,
        totalRevenue: 0,
      })
    }

    const product = productMap.get(productId)
    product.totalSold += item.quantity
    product.totalRevenue += item.total_price_cents
  })

  return Array.from(productMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10)
}

function processTopProducts(orderItems: any[]) {
  const productMap = new Map()

  orderItems.forEach((item) => {
    const productId = item.products?.id
    const productName = item.products?.name || "Unknown"

    if (!productMap.has(productId)) {
      productMap.set(productId, {
        id: productId,
        name: productName,
        quantity: 0,
        revenue: 0,
      })
    }

    const product = productMap.get(productId)
    product.quantity += item.quantity
    product.revenue += item.total_price_cents
  })

  return Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
}

function processDropPerformance(drops: any[]) {
  return drops.map((drop) => {
    const totalAvailable = drop.drop_products?.reduce((sum: number, dp: any) => sum + dp.quantity_available, 0) || 0
    const totalSold = drop.drop_products?.reduce((sum: number, dp: any) => sum + dp.quantity_sold, 0) || 0
    const sellThroughRate = totalAvailable > 0 ? (totalSold / totalAvailable) * 100 : 0

    return {
      id: drop.id,
      name: drop.name,
      status: drop.status,
      totalAvailable,
      totalSold,
      sellThroughRate: Math.round(sellThroughRate),
    }
  })
}

function processVipMetrics(vipData: any[]) {
  const tierCounts = vipData.reduce((acc, membership) => {
    const tierName = membership.vip_tiers?.name || "Unknown"
    acc[tierName] = (acc[tierName] || 0) + 1
    return acc
  }, {})

  const totalRevenue = vipData.reduce((sum, membership) => {
    return sum + (membership.vip_tiers?.price_cents || 0)
  }, 0)

  return {
    tierDistribution: Object.entries(tierCounts).map(([tier, count]) => ({
      tier,
      count,
    })),
    totalRevenue: totalRevenue / 100,
    totalMembers: vipData.length,
  }
}

function calculateConversionRate(totalUsers: number, totalOrders: number): number {
  if (totalUsers === 0) return 0
  return Math.round((totalOrders / totalUsers) * 100 * 100) / 100 // Round to 2 decimal places
}
