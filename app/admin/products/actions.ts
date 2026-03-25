"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const brand = formData.get("brand") as string
  const status = formData.get("status") as string
  const base_price = parseFloat(formData.get("base_price") as string)
  const tags = (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)
  const images = (formData.get("images") as string).split(",").map((i) => i.trim()).filter(Boolean)

  const { data: product, error } = await supabase
    .from("products")
    .insert({ name, description, category, brand, status, base_price, tags, images })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Create variants
  const variantCount = parseInt(formData.get("variant_count") as string) || 0
  for (let i = 0; i < variantCount; i++) {
    const size = formData.get(`variant_size_${i}`) as string
    const color = formData.get(`variant_color_${i}`) as string
    const price = parseFloat(formData.get(`variant_price_${i}`) as string)
    const inventory_count = parseInt(formData.get(`variant_inventory_${i}`) as string) || 0

    if (size) {
      await supabase.from("product_variants").insert({
        product_id: product.id,
        size,
        color,
        price,
        inventory_count,
        sku: `${product.id.slice(0, 8)}-${size}-${color}`.toUpperCase(),
      })
    }
  }

  revalidatePath("/admin/products")
  redirect(`/admin/products/${product.id}`)
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const brand = formData.get("brand") as string
  const status = formData.get("status") as string
  const base_price = parseFloat(formData.get("base_price") as string)
  const tags = (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)
  const images = (formData.get("images") as string).split(",").map((i) => i.trim()).filter(Boolean)

  const { error } = await supabase
    .from("products")
    .update({ name, description, category, brand, status, base_price, tags, images })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${id}`)
  redirect(`/admin/products/${id}`)
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function updateVariant(variantId: string, productId: string, formData: FormData) {
  const supabase = await createClient()

  const size = formData.get("size") as string
  const color = formData.get("color") as string
  const price = parseFloat(formData.get("price") as string)
  const inventory_count = parseInt(formData.get("inventory_count") as string) || 0

  const { error } = await supabase
    .from("product_variants")
    .update({ size, color, price, inventory_count })
    .eq("id", variantId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/products/${productId}`)
}

export async function deleteVariant(variantId: string, productId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("product_variants").delete().eq("id", variantId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/products/${productId}`)
}

export async function addVariant(productId: string, formData: FormData) {
  const supabase = await createClient()

  const size = formData.get("size") as string
  const color = formData.get("color") as string
  const price = parseFloat(formData.get("price") as string)
  const inventory_count = parseInt(formData.get("inventory_count") as string) || 0

  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    size,
    color,
    price,
    inventory_count,
    sku: `${productId.slice(0, 8)}-${size}-${color}`.toUpperCase(),
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/products/${productId}`)
}
