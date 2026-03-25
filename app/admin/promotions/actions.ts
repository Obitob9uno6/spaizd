"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCoupon(formData: FormData) {
  const supabase = await createClient()

  const code = (formData.get("code") as string).toUpperCase().trim()
  const description = formData.get("description") as string
  const discount_type = formData.get("discount_type") as string
  const discount_value = parseFloat(formData.get("discount_value") as string)
  const min_order_amount = formData.get("min_order_amount")
    ? parseFloat(formData.get("min_order_amount") as string)
    : null
  const max_discount_amount = formData.get("max_discount_amount")
    ? parseFloat(formData.get("max_discount_amount") as string)
    : null
  const usage_limit = formData.get("usage_limit") ? parseInt(formData.get("usage_limit") as string) : null
  const expires_at = (formData.get("expires_at") as string) || null
  const vip_only = formData.get("vip_only") === "true"
  const is_active = true

  const { error } = await supabase.from("coupons").insert({
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_discount_amount,
    usage_limit,
    expires_at,
    vip_only,
    is_active,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/promotions")
}

export async function updateCoupon(id: string, formData: FormData) {
  const supabase = await createClient()

  const description = formData.get("description") as string
  const discount_type = formData.get("discount_type") as string
  const discount_value = parseFloat(formData.get("discount_value") as string)
  const min_order_amount = formData.get("min_order_amount")
    ? parseFloat(formData.get("min_order_amount") as string)
    : null
  const max_discount_amount = formData.get("max_discount_amount")
    ? parseFloat(formData.get("max_discount_amount") as string)
    : null
  const usage_limit = formData.get("usage_limit") ? parseInt(formData.get("usage_limit") as string) : null
  const expires_at = (formData.get("expires_at") as string) || null
  const vip_only = formData.get("vip_only") === "true"

  const { error } = await supabase
    .from("coupons")
    .update({ description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, expires_at, vip_only })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/promotions")
}

export async function toggleCoupon(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from("coupons").update({ is_active }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/promotions")
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("coupons").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/promotions")
}

export async function createPromotion(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const promo_type = formData.get("promo_type") as string
  const discount_percent = formData.get("discount_percent") ? parseInt(formData.get("discount_percent") as string) : null
  const starts_at = formData.get("starts_at") as string
  const ends_at = (formData.get("ends_at") as string) || null
  const applies_to = formData.get("applies_to") as string
  const vip_only = formData.get("vip_only") === "true"
  const is_active = true

  const { error } = await supabase.from("promotions").insert({
    title,
    description,
    promo_type,
    discount_percent,
    starts_at,
    ends_at,
    applies_to,
    vip_only,
    is_active,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/promotions")
}

export async function togglePromotion(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from("promotions").update({ is_active }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/promotions")
}

export async function deletePromotion(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("promotions").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/promotions")
}
