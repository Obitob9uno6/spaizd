import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    // In a real implementation, verify the Stripe webhook signature here
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

    // For now, we'll parse the body as JSON for demonstration
    const event = JSON.parse(body)

    const supabase = createRouteHandlerClient({ cookies })

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object

        // Update order status
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "confirmed",
            stripe_payment_intent_id: paymentIntent.id,
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object

        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            status: "cancelled",
          })
          .eq("stripe_payment_intent_id", failedPayment.id)

        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}
