"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createDrop(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const slug =
    (formData.get("slug") as string) ||
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  const description = formData.get("description") as string
  const type = formData.get("type") as string
  const status = formData.get("status") as string
  const start_time = formData.get("start_time") as string
  const end_time = (formData.get("end_time") as string) || null
  const max_quantity = formData.get("max_quantity") ? parseInt(formData.get("max_quantity") as string) : null
  const vip_early_access = formData.get("vip_early_access") === "true"
  const vip_start_time = (formData.get("vip_start_time") as string) || null
  const queue_enabled = formData.get("queue_enabled") === "true"
  const gated_access = formData.get("gated_access") === "true"

  const { data: drop, error } = await supabase
    .from("drops")
    .insert({
      name,
      slug,
      description,
      type,
      status,
      start_time,
      end_time,
      max_quantity,
      vip_early_access,
      vip_start_time,
      queue_enabled,
      gated_access,
      images: [],
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/admin/drops")
  redirect(`/admin/drops/${drop.id}`)
}

export async function updateDrop(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const slug =
    (formData.get("slug") as string) ||
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  const description = formData.get("description") as string
  const type = formData.get("type") as string
  const status = formData.get("status") as string
  const start_time = formData.get("start_time") as string
  const end_time = (formData.get("end_time") as string) || null
  const max_quantity = formData.get("max_quantity") ? parseInt(formData.get("max_quantity") as string) : null
  const vip_early_access = formData.get("vip_early_access") === "true"
  const vip_start_time = (formData.get("vip_start_time") as string) || null
  const queue_enabled = formData.get("queue_enabled") === "true"
  const gated_access = formData.get("gated_access") === "true"

  const { error } = await supabase
    .from("drops")
    .update({
      name,
      slug,
      description,
      type,
      status,
      start_time,
      end_time,
      max_quantity,
      vip_early_access,
      vip_start_time,
      queue_enabled,
      gated_access,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/drops")
  revalidatePath(`/admin/drops/${id}`)
  redirect(`/admin/drops/${id}`)
}

export async function deleteDrop(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("drops").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/drops")
  redirect("/admin/drops")
}

export async function updateDropStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("drops").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/drops")
  revalidatePath(`/admin/drops/${id}`)
}
