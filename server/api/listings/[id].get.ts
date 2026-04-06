// server/api/listings/[id].get.ts
import { useServerSupabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const id = getRouterParam(event, "id");

  if (!id)
    throw createError({ statusCode: 400, message: "Missing listing id" });

  const { data, error } = await supabase
    .from("car_listings")
    .select(
      `
      *,
      car_images ( id, url, is_primary, sort_order ),
      profiles ( id, full_name, phone )
    `,
    )
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (error || !data) {
    throw createError({ statusCode: 404, message: "Listing not found" });
  }

  return { data, error: null };
});
