// server/api/listings/[id]/images.post.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  const listingId = getRouterParam(event, "id");

  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const body = await readBody(event);
  const { url, is_primary = false, sort_order = 0 } = body;

  if (!url) throw createError({ statusCode: 400, message: "Missing url" });

  // Verify ownership
  const { data: listing } = await supabase
    .from("car_listings")
    .select("seller_id")
    .eq("id", listingId)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!listing)
    throw createError({ statusCode: 404, message: "Listing not found" });
  if (listing.seller_id !== user.id && profile?.role !== "admin") {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  // If primary, unset all others
  if (is_primary) {
    await supabase
      .from("car_images")
      .update({ is_primary: false })
      .eq("listing_id", listingId);
  }

  const { data, error } = await supabase
    .from("car_images")
    .insert({ listing_id: listingId, url, is_primary, sort_order })
    .select()
    .single();

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data, error: null };
});
