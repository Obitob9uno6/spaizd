import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CouponForm } from "@/components/admin/coupon-form"

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single()

  if (!coupon) notFound()

  return <CouponForm initialCoupon={coupon} />
}
