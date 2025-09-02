import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Eye } from "lucide-react"

export default async function OrdersPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-led-green text-black"
      case "processing":
        return "bg-harvest-gold text-black"
      case "shipped":
        return "bg-blue-500 text-white"
      case "delivered":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-grow-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Your Orders</h1>

          {!orders || orders.length === 0 ? (
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                <p className="text-gray-400 mb-6">Start shopping to see your orders here.</p>
                <Button asChild className="bg-led-green hover:bg-led-green/90 text-black">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                        <p className="text-gray-400 text-sm">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Total:</span>
                          <p className="text-white font-medium">${order.total_amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Items:</span>
                          <p className="text-white font-medium">{order.order_items?.length || 0}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Payment:</span>
                          <p className="text-white font-medium capitalize">{order.payment_status}</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                        >
                          <Link href={`/account/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
