import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Log the webhook for processing
    await supabase.from("fulfillment_webhooks").insert({
      webhook_type: "printful",
      webhook_data: body,
      processed: false,
    })

    switch (body.type) {
      case "order_updated":
        const orderData = body.data

        // Update order fulfillment status
        if (orderData.external_id) {
          await supabase
            .from("orders")
            .update({
              status: orderData.status === "fulfilled" ? "shipped" : "processing",
              tracking_number: orderData.tracking_number,
            })
            .eq("id", orderData.external_id)
        }

        break

      case "order_failed":
        const failedOrder = body.data

        if (failedOrder.external_id) {
          await supabase.from("orders").update({ status: "failed" }).eq("id", failedOrder.external_id)
        }

        break

      default:
        console.log(`Unhandled Printful webhook type: ${body.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Printful webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}
